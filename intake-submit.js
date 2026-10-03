/* Jeff Electric: save intake before confirming receipt. No credentials in browser code. */
window.JeffElectricIntake = {
 async submit(data, form) {
  const id=form.dataset.intakeRequestId||(form.dataset.intakeRequestId=crypto.randomUUID());
  const central=new FormData();for(const [key,value] of data.entries())central.append(key,value);
  central.set('request_id',id);central.set('source_page',location.pathname);
  const response=await fetch('https://jeff-electric-meta-lead-receiver.jeffelectric-7256.chatgpt.site/intake/website',{method:'POST',body:central,signal:AbortSignal.timeout(25000)});
  const saved=await response.json();if(!response.ok||!saved.received)throw new Error(saved.error||'Could not save your request.');
  // Keep the existing Forminit notification; the shared sales inbox is the saved record.
  try {if(window.Forminit){const copy=new FormData();for(const [key,value] of data.entries())copy.append(key,value);await Promise.race([new Forminit().submit('pojgp0vhkve',copy),new Promise(resolve=>setTimeout(resolve,6000))]);}}catch(_){}
  return {data:{hashId:saved.id}};
 }
};
