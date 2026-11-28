// Deploy as a web app. Configure SERVICEM8_INBOX in Script Properties.
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const DAILY_INBOX_LIMIT = 60;

function doPost(event) {
  const raw = event && event.postData && event.postData.contents;
  if (!raw || raw.length > Math.ceil(MAX_PHOTO_BYTES * 4 / 3) + 10000) {
    return estimateJson({ accepted: false });
  }

  let enquiry;
  try {
    enquiry = readEstimate(JSON.parse(raw));
  } catch (_) {
    return estimateJson({ accepted: false });
  }

  const properties = PropertiesService.getScriptProperties();
  const inbox = properties.getProperty('SERVICEM8_INBOX');
  if (!inbox || !/^[a-z0-9]+@inbox\.servicem8\.com$/i.test(inbox)) {
    return estimateJson({ accepted: false });
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return estimateJson({ accepted: false });

  try {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const previousDate = properties.getProperty('ESTIMATE_RECEIPT_DATE');
    let receipts = JSON.parse(properties.getProperty('ESTIMATE_RECEIPTS') || '{}');
    if (previousDate !== today) {
      receipts = previousDate === yesterday ? { [yesterday]: receipts[yesterday] || {} } : {};
    }

    for (const date of [today, yesterday]) {
      if (Object.prototype.hasOwnProperty.call(receipts[date] || {}, enquiry.id)) {
        return estimateJson({ accepted: true, has_photo: receipts[date][enquiry.id] });
      }
    }

    const current = receipts[today] || {};
    if (Object.keys(current).length >= DAILY_INBOX_LIMIT || MailApp.getRemainingDailyQuota() < 1) {
      return estimateJson({ accepted: false });
    }

    const message = {
      to: inbox,
      subject: 'Jeff Electric website enquiry ' + enquiry.id,
      body: [
        'Name: ' + enquiry.name,
        'Phone: ' + enquiry.phone,
        'Email: ' + enquiry.email,
        'Address: ' + enquiry.address,
        '',
        'Request details:',
        enquiry.description,
      ].join('\n'),
    };
    if (enquiry.email) message.replyTo = enquiry.email;
    if (enquiry.photo) message.attachments = [enquiry.photo];
    MailApp.sendEmail(message);

    receipts[today] = current;
    current[enquiry.id] = Boolean(enquiry.photo);
    properties.setProperties({
      ESTIMATE_RECEIPT_DATE: today,
      ESTIMATE_RECEIPTS: JSON.stringify(receipts),
    });
    return estimateJson({ accepted: true, has_photo: Boolean(enquiry.photo) });
  } catch (_) {
    return estimateJson({ accepted: false });
  } finally {
    lock.releaseLock();
  }
}

function readEstimate(data) {
  const field = (key, max, required = true) => {
    const value = typeof data[key] === 'string' ? data[key].trim() : '';
    if ((required && !value) || value.length > max) throw new Error('Invalid field');
    return key === 'description' ? value : value.replace(/[\r\n]+/g, ' ');
  };
  const id = field('id', 36);
  const phone = field('phone', 30);
  const email = field('email', 254, false);
  if (data.company_site || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id) ||
      !/^(?:1)?\d{10}$/.test(phone.replace(/\D/g, '')) ||
      (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error('Invalid enquiry');
  }
  return { id, phone, email, name: field('name', 100), address: field('address', 250),
    description: field('description', 2000), photo: data.photo ? estimatePhoto(data.photo) : null };
}

function estimatePhoto(photo) {
  if (typeof photo !== 'string' || photo.length > Math.ceil(MAX_PHOTO_BYTES / 3) * 4) {
    throw new Error('Invalid photo size');
  }
  const bytes = Utilities.base64Decode(photo);
  if (!bytes.length || bytes.length > MAX_PHOTO_BYTES) throw new Error('Invalid photo size');
  const at = (index) => bytes[index] & 255;
  const text = (offset, length) => String.fromCharCode(...bytes.slice(offset, offset + length));
  if (at(0) === 255 && at(1) === 216 && at(2) === 255) {
    return Utilities.newBlob(bytes, 'image/jpeg', 'enquiry-photo.jpg');
  }
  if (at(0) === 137 && text(1, 3) === 'PNG' && text(4, 4) === '\r\n\x1a\n') {
    return Utilities.newBlob(bytes, 'image/png', 'enquiry-photo.png');
  }
  if (text(0, 4) === 'RIFF' && text(8, 4) === 'WEBP') {
    return Utilities.newBlob(bytes, 'image/webp', 'enquiry-photo.webp');
  }
  if (text(4, 4) === 'ftyp' && /^(heic|heix|hevc|hevx|mif1|msf1)$/.test(text(8, 4))) {
    return Utilities.newBlob(bytes, 'image/heic', 'enquiry-photo.heic');
  }
  throw new Error('Unsupported photo');
}

function estimateJson(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
