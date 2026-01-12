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

  // Phone
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

  contactList.appendChild(emailItem);
  contactList.appendChild(phoneItem);
  container.appendChild(contactList);

  main.appendChild(container);
}
