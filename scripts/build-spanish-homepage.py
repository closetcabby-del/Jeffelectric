#!/usr/bin/env python3
"""Build a static Spanish homepage from the existing GitHub Pages homepage.
No translation service, paid API, deployment, or customer request is invoked.
Run from the repository root. Review translations before release.
"""
from pathlib import Path
from html import escape, unescape
from html.parser import HTMLParser
import json
import re

ROOT = Path(__file__).resolve().parent.parent
TEXT = {
'Explore our electrical project photos →': 'Vea fotos de nuestros proyectos eléctricos →',
'Residential Electrician in Southeast Houston | Jeff Electric': 'Electricista residencial en el sureste de Houston | Jeff Electric',
'Residential electrical repairs, panel replacements, EV charger circuits and surge protection in Southeast Houston, Pasadena and nearby communities. Call Jeff Electric.': 'Reparaciones eléctricas residenciales, reemplazo de paneles, circuitos para cargadores de vehículos eléctricos y protección contra sobretensiones en el sureste de Houston y Pasadena. Llame a Jeff Electric.',
'Residential electrical service across Southeast Houston. Tell Jeff Electric what you need help with.': 'Servicios eléctricos residenciales en el sureste de Houston. Cuéntenos en qué necesita ayuda.',
'Services': 'Servicios', 'Reviews': 'Reseñas', 'Meet Jeff': 'Conozca a Jeff', 'Financing': 'Financiamiento', 'Service Areas': 'Áreas de servicio', 'Contact': 'Contacto',
'Call now': 'Llame ahora', 'Call Now': 'Llame ahora', '☎ Call Now': '☎ Llame ahora', 'Request an Estimate': 'Solicitar cotización', 'Request Estimate': 'Solicitar cotización',
'LOCAL RESIDENTIAL ELECTRICIANS · SOUTHEAST HOUSTON': 'ELECTRICISTAS RESIDENCIALES · SURESTE DE HOUSTON',
'Residential electrician': 'Electricista residencial', 'in Southeast Houston.': 'en el sureste de Houston.',
'You don’t have to diagnose it yourself. Tell Jeff Electric what you’re noticing, and we’ll help you understand the next step—clearly and without pressure.': 'No tiene que identificar la causa por su cuenta. Cuéntele a Jeff Electric lo que está notando y le ayudaremos a entender el siguiente paso, con claridad y sin presión.',
'27 Google reviews': '27 reseñas en Google', 'Texas Electrical Contractor License': 'Licencia de contratista eléctrico de Texas',
'Residential electrical service across Southeast Houston': 'Servicios eléctricos residenciales en el sureste de Houston',
'REAL PEOPLE. REAL WORK.': 'PERSONAS REALES. TRABAJO REAL.', 'Your local Jeff Electric team': 'Su equipo local de Jeff Electric',
'NO DIAGNOSIS NEEDED': 'NO NECESITA UN DIAGNÓSTICO', 'Tell us what you notice': 'Cuéntenos lo que nota',
'CLEAR EXPLANATIONS': 'EXPLICACIONES CLARAS', 'Understand your options': 'Conozca sus opciones',
'RESPECT FOR YOUR HOME': 'RESPETO POR SU HOGAR', 'A straightforward experience': 'Una experiencia sin complicaciones',
'YOU STAY IN CONTROL': 'USTED TIENE EL CONTROL', 'Choose how to proceed': 'Decida cómo continuar',
'CUSTOMER REVIEWS': 'RESEÑAS DE CLIENTES', 'Trusted by local homeowners.': 'La confianza de nuestros vecinos.',
'Jeff Electric’s public Google profile is rated 5.0 stars across 27 reviews.': 'El perfil público de Jeff Electric en Google tiene una calificación de 5.0 estrellas con 27 reseñas.',
'Google Review': 'Reseña de Google · Traducción del inglés',
'“I don’t usually write reviews, but Jeff’s Electric absolutely deserves it. From the moment I called, their team was professional, responsive, and genuinely cared about getting the job done right.”': '“No suelo escribir reseñas, pero Jeff’s Electric realmente se lo merece. Desde que llamé, su equipo fue profesional, atento y se preocupó de verdad por hacer bien el trabajo.”',
'“I had a great experience with Jeff Electric! They did an amazing job from start to finish. They were professional, knowledgeable, efficient, and made sure everything was done right.”': '“¡Tuve una excelente experiencia con Jeff Electric! Hicieron un gran trabajo de principio a fin. Fueron profesionales, conocedores y eficientes, y se aseguraron de que todo quedara bien.”',
'“Jeff and team were very professional. He called ahead and let me know when they would be at my home. They did a whole days work and were very efficient in all of the areas they worked on.”': '“Jeff y su equipo fueron muy profesionales. Llamó con anticipación para avisarme cuándo llegarían a mi casa. Trabajaron un día completo y fueron muy eficientes en todas las áreas en las que trabajaron.”',
'“Jeff did an excellent job upgrading our breakers and installing our sauna. He’s a professional and honest person and we appreciate his honesty and quality work.”': '“Jeff hizo un excelente trabajo al actualizar nuestros breakers e instalar nuestra sauna. Es una persona profesional y honesta, y agradecemos su honestidad y la calidad de su trabajo.”',
'“Jeff electric replace the electrical service at one of my investment properties, relocated the primary power to the exterior of the house and brought it up to code.”': '“Jeff Electric reemplazó el servicio eléctrico de una de mis propiedades de inversión, trasladó la alimentación principal al exterior de la casa y la puso al día con el código.”',
'“Lost power to half of my house (underground line root damage) explained to Jeff wanted repair and upgrade existing breaker box as well.”': '“La mitad de mi casa se quedó sin electricidad por daños de raíces en una línea subterránea. Le expliqué a Jeff que quería repararla y también actualizar el panel de breakers existente.”',
'“I like to give credit where it’s due, and boy was this a BIG ONE!!! Our lights had been going out on our 5year old pool till one day they didn’t turn on any more.”': '“Me gusta reconocer el buen trabajo, ¡y este fue un GRAN caso! Las luces de nuestra piscina de cinco años habían estado fallando hasta que un día ya no encendieron.”',
'START WHERE YOU ARE': 'EMPIECE CON LO QUE SABE', 'You bring the concern.': 'Usted nos cuenta su inquietud.', 'We’ll bring the clarity.': 'Nosotros le damos claridad.',
'Home electrical problems can feel uncertain. Our job is to make the conversation easy: listen first, explain clearly and let you decide what happens next.': 'Los problemas eléctricos del hogar pueden generar incertidumbre. Nuestro trabajo es facilitar la conversación: escuchar primero, explicar con claridad y dejar que usted decida cómo continuar.',
'WHAT ARE YOU DEALING WITH?': '¿QUÉ ESTÁ OCURRIENDO?', 'Start with what': 'Empiece por lo que', 'you notice.': 'está notando.',
'Choose the closest match. This does not diagnose the problem—it simply helps you start a useful conversation with our team.': 'Elija la opción que más se acerque a su situación. Esto no diagnostica el problema; solo ayuda a iniciar una conversación útil con nuestro equipo.',
'Nothing quite fits? That’s normal. Call us and describe it in your own words.': '¿Ninguna opción describe su situación? No se preocupe. Llámenos y explíquelo con sus propias palabras.',
'Breaker keeps tripping': 'El breaker se dispara repetidamente', 'Outlet or switch stopped working': 'Un contacto o apagador dejó de funcionar', 'Lights flicker or dim': 'Las luces parpadean o bajan de intensidad', 'Part of the home lost power': 'Parte de la casa se quedó sin electricidad',
'I may need a panel upgrade': 'Quizá necesito actualizar el panel', 'I want an EV charger': 'Quiero un cargador para mi vehículo eléctrico', 'I want surge protection': 'Quiero protección contra sobretensiones', 'I’m not sure what the problem is': 'No sé cuál es el problema',
'YOUR NEXT STEP': 'SU SIGUIENTE PASO', 'CALL JEFF ELECTRIC': 'LLAME A JEFF ELECTRIC', 'Start with a conversation': 'Empiece con una conversación',
'Tell us when it happens and what you notice. We’ll ask a few focused questions and help you understand the next step.': 'Cuéntenos cuándo ocurre y qué nota. Le haremos algunas preguntas concretas y le ayudaremos a entender el siguiente paso.',
'Call Jeff Electric': 'Llame a Jeff Electric', 'WHAT HAPPENS WHEN YOU CONTACT US?': '¿QUÉ PASA CUANDO NOS CONTACTA?',
'Four clear steps.': 'Cuatro pasos claros.', 'No guessing.': 'Sin adivinanzas.', 'YOU ALWAYS KNOW WHAT COMES NEXT.': 'SIEMPRE SABRÁ QUÉ SIGUE.',
'A homeowner-first experience built around calm communication, clear expectations and respect for your decisions.': 'Una experiencia centrada en usted, con comunicación tranquila, expectativas claras y respeto por sus decisiones.',
'TELL US': 'CUÉNTENOS', 'Share what’s happening': 'Cuéntenos qué ocurre',
'Call or send a short request. No technical explanation required—just tell us what you notice.': 'Llame o envíe una solicitud breve. No necesita dar una explicación técnica; solo cuéntenos lo que nota.',
'CLARIFY': 'ACLAREMOS', 'We discuss the next step': 'Hablamos del siguiente paso',
'We ask useful questions and explain whether a service visit fits your concern.': 'Hacemos preguntas útiles y le explicamos si una visita de servicio es adecuada para su situación.',
'EXPLAIN': 'EXPLICAMOS', 'Understand the recommendation': 'Entienda la recomendación',
'Your technician evaluates the issue and walks you through the findings in plain language.': 'Su técnico evalúa el problema y le explica los resultados con palabras sencillas.',
'YOU DECIDE': 'USTED DECIDE', 'You understand the options before work moves forward. Questions are welcome.': 'Conocerá las opciones antes de que el trabajo continúe. Sus preguntas son bienvenidas.',
'Ready for step one?': '¿Listo para dar el primer paso?', 'RESIDENTIAL SERVICES': 'SERVICIOS RESIDENCIALES', 'Home electrical work,': 'Servicios eléctricos para su hogar,', 'organized clearly.': 'explicados con claridad.',
'You do not need to pick the perfect service. These are common ways we help Southeast Houston homeowners.': 'No necesita saber exactamente qué servicio elegir. Estas son algunas de las formas en que ayudamos a los propietarios del sureste de Houston.',
'Troubleshooting & Repairs': 'Diagnóstico y reparaciones',
'Flickering lights, dead outlets, tripping breakers or partial power? We find the cause and explain the safest next step.': '¿Luces que parpadean, contactos sin corriente, breakers que se disparan o cortes parciales? Identificamos la causa y explicamos el siguiente paso más seguro.',
'Panel Repair & Replacement': 'Reparación y reemplazo de paneles',
'We evaluate overloaded, outdated or damaged panels and recommend repair or replacement based on your home’s actual needs.': 'Evaluamos paneles sobrecargados, antiguos o dañados y recomendamos repararlos o reemplazarlos según las necesidades reales de su hogar.',
'Outlets, Switches & Lighting': 'Contactos, apagadores e iluminación',
'Repair damaged devices, add convenient outlets, improve lighting and correct unsafe electrical connections.': 'Reparamos dispositivos dañados, agregamos contactos donde los necesita, mejoramos la iluminación y corregimos conexiones eléctricas inseguras.',
'EV-Charger Installation': 'Instalación de cargadores para vehículos eléctricos',
'Professional home-charger installation with a panel and circuit evaluation for safe, dependable charging.': 'Instalación profesional de cargadores en casa, con evaluación del panel y del circuito para una carga segura y confiable.',
'Whole-Home Surge Protection': 'Protección contra sobretensiones para toda la casa',
'Help protect appliances and sensitive electronics from voltage spikes with properly installed surge protection.': 'Ayude a proteger sus electrodomésticos y equipos electrónicos sensibles contra picos de voltaje con protección contra sobretensiones instalada correctamente.',
'Generator Connections': 'Conexiones para generadores',
'Prepare your home for backup power with safe generator connections and electrical-system evaluations.': 'Prepare su hogar para contar con energía de respaldo mediante conexiones seguras para generadores y evaluaciones del sistema eléctrico.',
'NOT SURE?': '¿NO ESTÁ SEGURO?',
'Describe what’s happening in your own words. We’ll help identify the right starting point.': 'Describa lo que ocurre con sus propias palabras. Le ayudaremos a encontrar por dónde empezar.',
'Call Jeff Electric →': 'Llame a Jeff Electric →', 'FINANCING AVAILABLE': 'FINANCIAMIENTO DISPONIBLE', 'Another option to consider.': 'Otra opción a considerar.',
'Financing is available for customers who would like to consider it as an option for their electrical project.': 'Hay financiamiento disponible para quienes deseen considerarlo como una opción para su proyecto eléctrico.',
'REAL JEFF ELECTRIC WORK': 'TRABAJO REAL DE JEFF ELECTRIC', 'The people and projects': 'Las personas y los proyectos', 'behind the promise.': 'detrás de nuestro compromiso.',
'No stock-photo crew. These are real Jeff Electric technicians working on real homes.': 'No son modelos de fotografías de catálogo. Son técnicos de Jeff Electric trabajando en hogares reales.',
'ON-SITE': 'EN EL LUGAR', 'Residential electrical work': 'Trabajo eléctrico residencial', 'BACKUP POWER': 'ENERGÍA DE RESPALDO', 'Generator connection project': 'Proyecto de conexión de generador',
'SERVICE EQUIPMENT': 'EQUIPO DE SERVICIO ELÉCTRICO', 'Panel and service work': 'Trabajo en paneles y servicio eléctrico', 'POOL ELECTRICAL': 'ELECTRICIDAD PARA PISCINAS', 'On-site residential work': 'Trabajo residencial en el lugar',
'OUTDOOR LIGHTING': 'ILUMINACIÓN EXTERIOR', 'Pool and landscape lighting': 'Iluminación de piscinas y jardines', 'FINISHED PROJECT': 'PROYECTO TERMINADO', 'Lighting after dark': 'Iluminación nocturna',
'PROUDLY SERVING OUR NEIGHBORS': 'CON ORGULLO SERVIMOS A NUESTROS VECINOS', 'Residential electrical service': 'Servicio eléctrico residencial', 'across Southeast Houston.': 'en el sureste de Houston.',
'Southeast Houston is our service umbrella. Jeff Electric helps homeowners throughout the area with clear communication and professional electrical service.': 'Nuestra zona de servicio abarca el sureste de Houston. Ayudamos a los propietarios de toda el área con comunicación clara y servicios eléctricos profesionales.',
'Southeast Houston': 'Sureste de Houston', 'SOUTHEAST HOUSTON': 'SURESTE DE HOUSTON', 'Not sure if we serve your area? Ask us →': '¿No sabe si atendemos su zona? Pregúntenos →',
'Residential service coverage': 'Cobertura de servicio residencial', 'CORE SERVICE UMBRELLA': 'ZONA PRINCIPAL DE SERVICIO', 'REQUEST AN ESTIMATE': 'SOLICITE UNA COTIZACIÓN', 'Tell us what’s': 'Cuéntenos qué', 'happening.': 'está pasando.',
'You do not need the right terminology. Share what you notice, what you want to add or what you’re unsure about. We’ll contact you to discuss the next step.': 'No necesita conocer los términos técnicos. Cuéntenos lo que nota, lo que desea instalar o las dudas que tenga. Le contactaremos para hablar del siguiente paso.',
'Prefer to talk now?': '¿Prefiere hablar ahora?', 'Hours: 8 AM–7 PM daily.': 'Horario: todos los días, de 8 a. m. a 7 p. m.',
'Your information is used only to respond to your service request.': 'Su información se utiliza únicamente para responder a su solicitud de servicio.',
'Full name': 'Nombre completo', 'Phone number': 'Número de teléfono', 'ZIP code': 'Código postal', 'Preferred contact': 'Cómo prefiere que le contactemos', 'Phone call': 'Llamada telefónica', 'Text message': 'Mensaje de texto', 'Email': 'Correo electrónico',
'Email address (required for email replies)': 'Correo electrónico (obligatorio para recibir respuesta por correo)', 'Residential service needed': 'Servicio residencial que necesita', 'Select a service': 'Seleccione un servicio', 'Something else': 'Otro servicio', 'What do you need help with?': '¿En qué necesita ayuda?',
'Photo of the issue (optional; JPG, PNG or WebP, up to 8 MB)': 'Foto del problema (opcional; JPG, PNG o WebP, hasta 8 MB)',
'Quick Links': 'Enlaces rápidos', 'All Residential Services': 'Todos los servicios residenciales', 'Surge Protection': 'Protección contra sobretensiones', '© 2026 Jeff Electric. All rights reserved. TECL 39762.': '© 2026 Jeff Electric. Todos los derechos reservados. TECL 39762.',
'Jeff Electric home': 'Inicio de Jeff Electric', 'Jeff Electric — Wiring Tomorrow, Today': 'Jeff Electric', 'Toggle menu': 'Abrir o cerrar el menú', 'Main navigation': 'Navegación principal', 'Jeff Electric credentials': 'Credenciales de Jeff Electric',
'Two Jeff Electric team members on a residential electrical project': 'Dos miembros del equipo de Jeff Electric en un proyecto eléctrico residencial', 'Google customer reviews': 'Reseñas de clientes en Google', '5 out of 5 stars': '5 de 5 estrellas', 'What homeowners can expect': 'Qué pueden esperar los propietarios', 'Electrical symptoms': 'Señales de problemas eléctricos',
'Learn about Troubleshooting & Repairs': 'Más información sobre diagnóstico y reparaciones', 'Learn about Panel Repair & Replacement': 'Más información sobre reparación y reemplazo de paneles', 'Ask about Outlets, Switches & Lighting': 'Pregunte sobre contactos, apagadores e iluminación', 'Learn about EV-Charger Installation': 'Más información sobre instalación de cargadores para vehículos eléctricos', 'Learn about Whole-Home Surge Protection': 'Más información sobre protección contra sobretensiones', 'Learn about Generator Connections': 'Más información sobre conexiones para generadores',
'Jeff Electric crew installing residential electrical conduit beside a home': 'Equipo de Jeff Electric instalando conductos eléctricos residenciales junto a una casa', 'Residential Generac generator and electrical service equipment': 'Generador residencial Generac y equipo de servicio eléctrico', 'Residential electrical panel and meter equipment': 'Panel eléctrico y equipo de medición residencial', 'Jeff Electric technician working near a residential pool': 'Técnico de Jeff Electric trabajando cerca de una piscina residencial', 'Residential swimming pool illuminated with green underwater lighting at night': 'Piscina residencial con iluminación subacuática verde por la noche', 'Residential swimming pool illuminated with blue underwater lighting at night': 'Piscina residencial con iluminación subacuática azul por la noche',
'Southeast Houston service area map showing Pasadena, Pearland, Friendswood, Webster and Clear Lake': 'Ilustración del área de servicio en el sureste de Houston: Pasadena, Pearland, Friendswood, Webster y Clear Lake', 'Licensing information': 'Información de licencia', 'Your name': 'Su nombre',
'Tell us what you noticed, when it started, and anything else that may help.': 'Cuéntenos lo que notó, cuándo empezó y cualquier otro detalle que pueda ayudar.',
'Preferred language for follow-up (optional)': 'Idioma que prefiere para el seguimiento (opcional)', 'No preference': 'Sin preferencia',
}
DYNAMIC = {
'Start with a conversation': 'Empiece con una conversación',
'Tell us when it happens and what you notice. We’ll ask a few focused questions and help you understand the next step.': TEXT['Tell us when it happens and what you notice. We’ll ask a few focused questions and help you understand the next step.'],
'We can help you sort it out': 'Le ayudamos a aclarar la situación',
'You do not need to diagnose it. Let us know what stopped working and we’ll guide the conversation from there.': 'No tiene que diagnosticarlo. Díganos qué dejó de funcionar y le orientaremos a partir de ahí.',
'Tell us what you’re noticing': 'Cuéntenos lo que está notando',
'Share where and when it happens. Our team will listen, clarify the concern and discuss the right service next step.': 'Cuéntenos dónde y cuándo ocurre. Escucharemos, aclararemos su inquietud y hablaremos del siguiente paso adecuado.',
'Let’s clarify what is affected': 'Aclaremos qué está afectado',
'Describe which rooms or areas are affected. We’ll gather the useful details and explain what to expect next.': 'Describa qué habitaciones o áreas están afectadas. Reuniremos los detalles útiles y le explicaremos qué sigue.',
'Let’s talk about your home’s needs': 'Hablemos de las necesidades de su hogar',
'Tell us what is prompting the upgrade. We’ll discuss your goals and what a professional evaluation would involve.': 'Cuéntenos por qué desea actualizar el sistema. Hablaremos de sus objetivos y de lo que implica una evaluación profesional.',
'Plan dependable home charging': 'Planee una carga confiable en casa',
'Tell us about your vehicle and charging goals. We’ll explain the information needed to plan the installation.': 'Cuéntenos sobre su vehículo y sus necesidades de carga. Le explicaremos qué información se necesita para planear la instalación.',
'Protect what powers your home': 'Proteja los equipos de su hogar',
'We can discuss whole-home surge protection and how it may fit your electrical system and household priorities.': 'Podemos hablar de protección contra sobretensiones para toda la casa y de cómo se adapta a su sistema eléctrico y sus prioridades.',
'That’s completely okay': 'No se preocupe',
'Describe what you see, hear or experience in your own words. You do not need the technical answer before you call.': 'Describa lo que ve, escucha o nota con sus propias palabras. No necesita conocer la respuesta técnica antes de llamar.',
'Request received.': 'Solicitud recibida.',
'Thanks. Jeff Electric received your estimate request and will follow up using the contact information you provided. Prefer to talk now? Call ': 'Gracias. Jeff Electric recibió su solicitud de cotización y le contactará con los datos que proporcionó. ¿Prefiere hablar ahora? Llame al ',
'Sorry, something went wrong sending your request. Please call Jeff Electric at (346) 398-4485.': 'Lo sentimos, no se pudo enviar su solicitud. Llame a Jeff Electric al (346) 398-4485.',
}
MOTION = {
'Meet Jeff': 'Conozca a Jeff', 'Full Jeff Electric featured video with sound': 'Video completo de Jeff Electric con sonido, en inglés', 'Play Jeff Electric featured video with sound': 'Reproducir el video de Jeff Electric con sonido, en inglés', 'Replay Jeff Electric featured video': 'Volver a reproducir el video de Jeff Electric', 'Watch again': 'Ver de nuevo', 'Follow Jeff Electric on social media': 'Siga a Jeff Electric en redes sociales', 'Follow Jeff': 'Siga a Jeff', 'Jeff Electric on Instagram': 'Jeff Electric en Instagram', 'Jeff Electric on Facebook': 'Jeff Electric en Facebook', 'Quick Links': 'Enlaces rápidos', 'Follow Us': 'Síganos',
}
LEGACY = {
'JEFF ELECTRIC POWER GRID': 'ÁREA DE JEFF ELECTRIC', 'Southeast Houston service umbrella': 'Zona de servicio del sureste de Houston', 'Tap a community to explore our residential service area.': 'Toque una comunidad para explorar nuestra área de servicio residencial.', 'RESIDENTIAL SERVICE AREA': 'ÁREA DE SERVICIO RESIDENCIAL', 'Call Jeff Electric to confirm availability for your address.': 'Llame a Jeff Electric para confirmar la disponibilidad en su dirección.',
'QUICK REQUEST': 'SOLICITUD RÁPIDA', 'Get a quote or': 'Solicite una cotización o', 'send us a photo.': 'envíenos una foto.', 'Tell us the basics. No electrical terminology needed.': 'Cuéntenos lo esencial. No necesita términos técnicos.', 'What is happening, what do you want installed, or what are you unsure about?': '¿Qué está pasando, qué desea instalar o qué dudas tiene?', 'Send Request': 'Enviar solicitud', 'Send a service request ↑': 'Enviar una solicitud de servicio ↑', 'Request Estimate': 'Solicitar cotización',
'SOUTHEAST HOUSTON SERVICE AREA': 'ÁREA DE SERVICIO DEL SURESTE DE HOUSTON', 'Local residential electrical service': 'Servicio eléctrico residencial local', 'Tap a community to explore the area. Service-area illustration — call to confirm your address.': 'Toque una comunidad para explorar el área. El mapa es ilustrativo; llame para confirmar su dirección.', 'Jeff Electric service hub': 'Área de servicio de Jeff Electric', 'Jeff Electric residential services': 'Servicios residenciales de Jeff Electric', 'Service ${i+1} of ${cards.length}': 'Servicio ${i+1} de ${cards.length}', 'Previous service': 'Servicio anterior', 'Next service': 'Servicio siguiente',
}
CSS = '''/* Visible language choice; no automatic redirects. Shared by both homepages. */
.language-switch{display:flex;align-items:center;gap:2px;flex:none;white-space:nowrap;font-size:12px;font-weight:700}
.language-switch a{display:inline-flex;min-height:44px;min-width:65px;align-items:center;justify-content:center;padding:0 8px;color:#d4d4d4;border:1px solid transparent;border-radius:4px}
.language-switch a[aria-current="page"]{color:#f2b21a;background:#222016;border-color:#6b541d}
.language-switch a:hover,.language-switch a:focus-visible{color:#f2b21a;outline:2px solid #f2b21a;outline-offset:2px}
.english-link-note{font-size:11px;font-weight:400;white-space:normal;letter-spacing:normal;text-transform:none}
.language-note{font-size:13px;line-height:1.6;color:#bdbdbd;margin-top:12px}
.language-form-error{color:#ffce99;font-size:14px;line-height:1.5;margin:12px 0}
.language-file-choice{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:8px;font-size:13px;letter-spacing:normal;text-transform:none}
.language-file-choice button{padding:10px 14px;background:#292929;color:#fff;border:1px solid #777;min-height:44px;cursor:pointer}
html body main form input.language-file-input{display:none!important;position:absolute!important;opacity:0!important;width:1px!important;height:1px!important;padding:0!important;clip-path:inset(50%)}
.language-file-choice button:focus-visible{outline:2px solid #f2b21a;outline-offset:3px}
html body main .site-header{gap:14px;padding-inline:24px}
html body main .site-header .brand{order:0}
html body main .site-header .nav{order:1;gap:18px}
html body main .site-header .language-switch{order:2}
html body main .site-header .header-actions{order:3;gap:12px}
html body main .site-header .menu-button{order:4}
html[lang="es"] .hero h1{font-size:clamp(42px,5vw,74px);line-height:1.04}
html[lang="es"] .button{text-align:center;white-space:normal}
html[lang="es"] .compact-services article>div{min-width:0}
html[lang="es"] .compact-services h3{overflow-wrap:anywhere}
@media(min-width:721px) and (max-width:1499px){
 html body main .site-header .nav{display:none;position:absolute;top:82px;left:0;right:0;padding:24px;background:#080808;flex-direction:column;max-height:calc(100dvh - 82px);overflow-y:auto}
 html body main .site-header .nav.open{display:flex}
 html body main .site-header .menu-button{display:grid;place-items:center;min-width:44px;min-height:44px;margin-left:0}
 html body main .site-header .language-switch{margin-left:auto}
 html body main .site-header .header-actions .phone{display:none}
}
@media(max-width:720px){
 html body main .site-header{display:grid!important;grid-template-columns:minmax(0,1fr) 44px!important;grid-template-rows:64px 44px!important;gap:0 12px!important;height:116px!important;min-height:116px!important;padding:4px 18px!important}
 html body main .site-header .brand{grid-column:1;grid-row:1;max-width:100%!important}
 html body main .site-header .menu-button{grid-column:2;grid-row:1}
 html body main .site-header .language-switch{grid-column:1 / -1;grid-row:2;justify-content:flex-end;width:100%;border-top:1px solid #292929}
 html body main .site-header .language-switch a{min-height:40px}
 html body main .site-header .nav{top:116px!important;max-height:calc(100dvh - 116px)!important}
 html body main section[id]{scroll-margin-top:132px!important}
 html[lang="es"] .hero h1{font-size:clamp(38px,10vw,48px)!important}
 html[lang="es"] .mobile-bar a{font-size:12px!important;text-align:center}
 html[lang="es"] .compact-services article{grid-template-columns:24px minmax(0,1fr) 24px!important;gap:10px!important;padding-inline:16px!important}
 html[lang="es"] .compact-services h3{font-size:22px!important}
}
'''
JS = '''/* Language navigation and validation. Never persist form contents. */
(() => {
  const es = document.documentElement.lang === 'es';
  const say = (en, spanish) => es ? spanish : en;
  const form = document.querySelector('form[action="https://forminit.com/f/pojgp0vhkve"]');
  let dirty = false;
  const status = document.createElement('p');
  status.className = 'language-form-error'; status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const photo = form?.querySelector('input[type="file"]');
  const validatePhoto = () => {
    if (!photo) return true;
    const file = photo.files?.[0];
    let message = '';
    if (file && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      message = say('Please choose a JPG, PNG or WebP image.', 'Seleccione una imagen JPG, PNG o WebP.');
    else if (file && file.size > 8 * 1024 * 1024)
      message = say('Please choose an image no larger than 8 MB.', 'Seleccione una imagen de hasta 8 MB.');
    photo.setCustomValidity(message); status.textContent = message;
    return !message;
  };
  if (form) {
    form.append(status);
    form.addEventListener('input', (event) => {
      dirty = true;
      if (event.target.setCustomValidity) event.target.setCustomValidity('');
    });
    form.addEventListener('change', (event) => {
      dirty = true;
      if (event.target.setCustomValidity) event.target.setCustomValidity('');
      validatePhoto();
    });
    form.addEventListener('invalid', (event) => {
      const field = event.target;
      if (field === photo) { validatePhoto(); event.preventDefault(); status.scrollIntoView({block:'center'}); return; }
      if (field.validity.valueMissing) field.setCustomValidity(say('Please complete this field.', 'Complete este campo.'));
      else if (field.validity.typeMismatch && field.type === 'email') field.setCustomValidity(say('Please enter a valid email address.', 'Ingrese un correo electrónico válido.'));
    }, true);
    document.addEventListener('submit', (event) => {
      if (event.target !== form) return;
      if (!validatePhoto()) { event.preventDefault(); event.stopImmediatePropagation(); status.scrollIntoView({block:'center'}); }
    }, true);
    if (photo) {
      const chooser = document.createElement('div'); chooser.className = 'language-file-choice';
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = say('Choose photo', 'Elegir foto');
      const filename = document.createElement('span'); filename.setAttribute('aria-live','polite');
      const refresh = () => { filename.textContent = photo.files?.[0]?.name || say('No photo selected', 'Ninguna foto seleccionada'); };
      refresh(); button.addEventListener('click', () => photo.click());
      photo.addEventListener('change', refresh); photo.classList.add('language-file-input');
      photo.setAttribute('tabindex', '-1');
      chooser.append(button, filename); photo.after(chooser);
    }
  }
  document.querySelectorAll('.language-switch a').forEach(link => {
    if (link.getAttribute('aria-current') === 'page') return;
    // Only carry existing allowlisted campaign fields; never arbitrary query/form data.
    const target = new URL(link.href);
    const params = new URLSearchParams(location.search);
    for (const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) {
      const value = params.get(key);
      if (value && /^[a-zA-Z0-9 _.-]{1,100}$/.test(value)) target.searchParams.set(key, value);
    }
    link.href = target.href;
    link.addEventListener('click', event => {
      if (form?.isConnected && form.querySelector('button[type="submit"]')?.disabled) {
        event.preventDefault();
        alert(say('Your request is still sending. Please stay on this page.', 'Su solicitud se está enviando. Permanezca en esta página.'));
        return;
      }
      if (dirty && form?.isConnected && !confirm(say(
        'Switch languages? Your unsent form entries will be cleared and your photo must be selected again.',
        '¿Cambiar de idioma? Se borrarán los datos del formulario que no ha enviado y deberá elegir la foto de nuevo.'
      ))) { event.preventDefault(); return; }
      // Map the existing mobile form anchor to the equivalent page section.
      const hash = location.hash === '#mobile-quote' ? '#contact' : location.hash;
      if (/^#[a-z][a-z0-9-]*$/i.test(hash)) target.hash = hash;
      link.href = target.href;
    });
  });
})();
'''

class SpanishHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []; self.raw = None; self.english_anchor = None; self.untranslated = set()
    def handle_decl(self, decl): self.parts.append('<!' + decl + '>')
    def handle_comment(self, data): self.parts.append('<!--' + data + '-->')
    def start(self, tag, attrs):
        raw = self.get_starttag_text(); attrs = dict(attrs)
        if tag in ('script', 'style'): self.raw = tag
        for key in ('alt', 'aria-label', 'placeholder', 'content'):
            value = attrs.get(key)
            if value in TEXT:
                raw = re.sub(r'(\b' + key + r'\s*=\s*)([\"\x27])(.*?)\2', lambda m: m[1] + m[2] + escape(TEXT[value], quote=True) + m[2], raw, flags=re.S)
        if tag == 'html': raw = raw.replace('lang="en"', 'lang="es"')
        raw = re.sub(r'(\b(?:src|href)\s*=\s*[\"\x27])\./', r'\1/', raw)
        if tag == 'a' and (attrs.get('href') or '').endswith('.html'):
            self.english_anchor = []
            raw = raw[:-1] + ' hreflang="en" data-english-target="true" title="Página en inglés">'
            raw = re.sub(r'(aria-label=")(.*?)(")', r'\1\2 (página en inglés)\3', raw)
        self.parts.append(raw)
    def handle_starttag(self, tag, attrs): self.start(tag, attrs)
    def handle_startendtag(self, tag, attrs): self.start(tag, attrs)
    def handle_endtag(self, tag):
        if tag == self.raw: self.raw = None
        if tag == 'a' and self.english_anchor is not None:
            if ''.join(self.english_anchor).strip() not in ('', '→'):
                self.parts.append(' <span class="english-link-note">(en inglés)</span>')
            self.english_anchor = None
        self.parts.append('</' + tag + '>')
    def handle_data(self, data):
        if self.raw:
            self.parts.append(data); return
        normalized = ' '.join(data.split())
        if self.english_anchor is not None: self.english_anchor.append(data)
        if normalized in TEXT:
            leading = data[:len(data)-len(data.lstrip())]
            trailing = data[len(data.rstrip()):]
            self.parts.append(leading + escape(TEXT[normalized], quote=False) + trailing)
        else:
            if normalized and re.search('[A-Za-z]', normalized): self.untranslated.add(normalized)
            self.parts.append(escape(data, quote=False))


def replace_strings(code, mapping):
    for old, new in sorted(mapping.items(), key=lambda item: -len(item[0])):
        code = code.replace(old, new)
    return code


def build():
    english = (ROOT/'index.html').read_text()
    # Idempotent additions: do not rewrite existing English copy, CSS, or intake logic.
    alternates = '\n    <link rel="alternate" hreflang="en" href="https://jeffelectric.online/" />\n    <link rel="alternate" hreflang="es" href="https://jeffelectric.online/es/" />\n    <link rel="alternate" hreflang="x-default" href="https://jeffelectric.online/" />\n    <link rel="stylesheet" href="/language-switch.css?v=1" />\n    <script src="/language-switch.js?v=1" defer></script>'
    if 'hreflang="es"' not in english:
        anchor = '<link rel="canonical" href="https://jeffelectric.online/" />'
        assert english.count(anchor) == 1
        english = english.replace(anchor, anchor + alternates)
    nav = '<nav class="language-switch" aria-label="Language"><a href="/" lang="en" hreflang="en" aria-current="page">English</a><span aria-hidden="true">|</span><a href="/es/" lang="es" hreflang="es">Español</a></nav>'
    if 'class="language-switch"' not in english:
        anchor = '        <nav class="nav" aria-label="Main navigation">'
        assert english.count(anchor) == 1
        english = english.replace(anchor, '        ' + nav + '\n' + anchor)
    field = '<input type="hidden" name="fi-text-pageLanguage" value="en" />\n          <label>Preferred language for follow-up (optional)<select name="fi-select-preferredLanguage"><option value="" selected>No preference</option><option value="English">English</option><option value="Spanish" lang="es">Español</option></select></label>\n          '
    if 'fi-select-preferredLanguage' not in english:
        anchor = '<label>Email address (required for email replies)'
        assert english.count(anchor) == 1
        english = english.replace(anchor, field + anchor)
    # Stable option values keep intake routing and Email-required behavior unchanged.
    def option(match):
        attrs, text = match.groups()
        if not re.search(r'\bvalue\s*=', attrs): attrs += ' value="' + escape(unescape(text), quote=True) + '"'
        return '<option' + attrs + '>' + text + '</option>'
    spanish_source = re.sub(r'<option([^>]*)>(.*?)</option>', option, english, flags=re.S)
    parser = SpanishHTML(); parser.feed(spanish_source)
    spanish = ''.join(parser.parts)
    spanish = spanish.replace('rel="canonical" href="https://jeffelectric.online/"', 'rel="canonical" href="https://jeffelectric.online/es/"')
    spanish = spanish.replace('property="og:url" content="https://jeffelectric.online/"', 'property="og:url" content="https://jeffelectric.online/es/"')
    spanish = spanish.replace('aria-label="Language"', 'aria-label="Idioma"')
    spanish = spanish.replace('hreflang="en" aria-current="page"', 'hreflang="en"').replace('href="/es/" lang="es" hreflang="es"', 'href="/es/" lang="es" hreflang="es" aria-current="page"')
    spanish = spanish.replace('name="fi-text-pageLanguage" value="en"', 'name="fi-text-pageLanguage" value="es"')
    spanish = replace_strings(spanish, DYNAMIC)
    spanish = spanish.replace('src="/mobile-motion.js?v=4"', 'src="/es/mobile-motion.js?v=1"')
    spanish = spanish.replace('<body>', '<body>\n    <noscript><style>.reveal,.motion-ready{opacity:1!important;transform:none!important}.contact>form{display:block!important}</style><p class="language-note">Active JavaScript para enviar una solicitud en línea o llame al <a href="tel:+13463984485">(346) 398-4485</a>.</p></noscript>')
    motion = replace_strings((ROOT/'mobile-motion.js').read_text(), MOTION)
    motion = motion.replace("'./mobile-motion-legacy.js?v=4'", "'/es/mobile-motion-legacy.js?v=1'").replace('./public/', '/public/')
    motion = motion.replace('<h2 id="jeff-feature-title">Conozca a Jeff</h2>', '<h2 id="jeff-feature-title">Conozca a Jeff</h2><p class="language-note">Video en inglés.</p>')
    legacy = replace_strings((ROOT/'mobile-motion-legacy.js').read_text(), LEGACY).replace('./public/', '/public/')
    legacy = legacy.replace("'aria-roledescription','carousel'", "'aria-roledescription','carrusel'")
    sitemap = (ROOT/'sitemap.xml').read_text()
    if '<loc>https://jeffelectric.online/es/</loc>' not in sitemap:
        sitemap = sitemap.replace('</urlset>', '<url><loc>https://jeffelectric.online/es/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n</urlset>')
    outputs = {'index.html': english, 'es/index.html': spanish, 'es/mobile-motion.js': motion, 'es/mobile-motion-legacy.js': legacy, 'language-switch.css': CSS, 'language-switch.js': JS, 'sitemap.xml': sitemap}
    for name, content in outputs.items():
        path = ROOT/name; path.parent.mkdir(parents=True, exist_ok=True); path.write_text(content)
    # Existing test assumed every sitemap URL is a .html file; support /es/ directories.
    path = ROOT/'tests/public-seo.test.mjs'; code = path.read_text()
    code = code.replace("url.pathname==='/'?'index.html':url.pathname.slice(1)", "url.pathname.endsWith('/')?url.pathname.slice(1)+'index.html':url.pathname.slice(1)")
    path.write_text(code)
    print('Generated:', ', '.join(outputs))
    print('Untranslated static text (proper names and stable identifiers require manual review):')
    print(json.dumps(sorted(parser.untranslated), ensure_ascii=False, indent=2))

if __name__ == '__main__': build()
