import { catalogService } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';

export function renderContactPage(): void {
  const main = document.getElementById('main');
  if (!main) return;

  main.innerHTML = '';
  main.className = 'contact-page';

  const backBtn = document.createElement('button');
  backBtn.className = 'btn-back';
  backBtn.textContent = '← ' + i18n.t('button.backToHome');
  backBtn.onclick = () => router.navigate('/');
  main.appendChild(backBtn);

  const container = document.createElement('div');
  container.className = 'contact-container';

  const title = document.createElement('h1');
  title.textContent = i18n.t('contact.title');
  container.appendChild(title);

  const description = document.createElement('p');
  description.className = 'contact-description';
  description.textContent = i18n.t('contact.description');
  container.appendChild(description);

  const contact = catalogService.getContactInfo();

  const contactList = document.createElement('div');
  contactList.className = 'contact-list';

  // Email
  const emailItem = document.createElement('div');
  emailItem.className = 'contact-item';

  const emailIcon = document.createElement('span');
  emailIcon.className = 'contact-icon';
  emailIcon.textContent = '✉️';

  const emailContent = document.createElement('div');
  emailContent.className = 'contact-content';

  const emailLabel = document.createElement('span');
  emailLabel.className = 'contact-label';
  emailLabel.textContent = i18n.t('contact.email');

  const emailLink = document.createElement('a');
  emailLink.href = `mailto:${contact.email}`;
  emailLink.className = 'contact-link';
  emailLink.textContent = contact.email;

  emailContent.appendChild(emailLabel);
  emailContent.appendChild(emailLink);
  emailItem.appendChild(emailIcon);
  emailItem.appendChild(emailContent);

  contactList.appendChild(emailItem);

  // Phone (only show if not empty)
  if (contact.phone) {
    const phoneItem = document.createElement('div');
    phoneItem.className = 'contact-item';

    const phoneIcon = document.createElement('span');
    phoneIcon.className = 'contact-icon';
    phoneIcon.textContent = '📞';

    const phoneContent = document.createElement('div');
    phoneContent.className = 'contact-content';

    const phoneLabel = document.createElement('span');
    phoneLabel.className = 'contact-label';
    phoneLabel.textContent = i18n.t('contact.phone');

    const phoneLink = document.createElement('a');
    phoneLink.href = `tel:${contact.phone}`;
    phoneLink.className = 'contact-link';
    phoneLink.textContent = contact.phone;

    phoneContent.appendChild(phoneLabel);
    phoneContent.appendChild(phoneLink);
    phoneItem.appendChild(phoneIcon);
    phoneItem.appendChild(phoneContent);

    contactList.appendChild(phoneItem);
  }

  // Website
  const websiteUrl = 'https://sunan-irystec.github.io/bracelet/';
  const websiteItem = document.createElement('div');
  websiteItem.className = 'contact-item';

  const websiteIcon = document.createElement('span');
  websiteIcon.className = 'contact-icon';
  websiteIcon.textContent = '🌐';

  const websiteContent = document.createElement('div');
  websiteContent.className = 'contact-content';

  const websiteLabel = document.createElement('span');
  websiteLabel.className = 'contact-label';
  websiteLabel.textContent = i18n.t('contact.website');

  const websiteLink = document.createElement('a');
  websiteLink.href = websiteUrl;
  websiteLink.className = 'contact-link';
  websiteLink.textContent = websiteUrl;
  websiteLink.target = '_blank';
  websiteLink.rel = 'noopener noreferrer';

  websiteContent.appendChild(websiteLabel);
  websiteContent.appendChild(websiteLink);
  websiteItem.appendChild(websiteIcon);
  websiteItem.appendChild(websiteContent);

  contactList.appendChild(websiteItem);
  container.appendChild(contactList);

  // QR Code section
  const qrSection = document.createElement('div');
  qrSection.className = 'qr-section';

  const qrTitle = document.createElement('h3');
  qrTitle.textContent = i18n.t('contact.website');
  qrTitle.style.marginTop = '2rem';
  qrTitle.style.marginBottom = '1rem';
  qrSection.appendChild(qrTitle);

  const qrImage = document.createElement('img');
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(websiteUrl)}`;
  qrImage.alt = 'Website QR Code';
  qrImage.className = 'qr-code';
  qrImage.style.border = '2px solid #ddd';
  qrImage.style.borderRadius = '8px';
  qrImage.style.padding = '10px';
  qrImage.style.backgroundColor = 'white';
  qrSection.appendChild(qrImage);

  container.appendChild(qrSection);

  main.appendChild(container);
}
