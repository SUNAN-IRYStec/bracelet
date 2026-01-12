import { catalogService } from '../data/catalog';
import { i18n } from '../i18n';
import { router } from '../router';

const WEBSITE_URL = 'https://sunan-irystec.github.io/bracelet/';

interface ContactItemConfig {
  icon: string;
  labelKey: string;
  href: string;
  text: string;
  external?: boolean;
}

function createContactItem(config: ContactItemConfig): HTMLElement {
  const item = document.createElement('div');
  item.className = 'contact-item';

  const icon = document.createElement('span');
  icon.className = 'contact-icon';
  icon.textContent = config.icon;

  const content = document.createElement('div');
  content.className = 'contact-content';

  const label = document.createElement('span');
  label.className = 'contact-label';
  label.textContent = i18n.t(config.labelKey);

  const link = document.createElement('a');
  link.href = config.href;
  link.className = 'contact-link';
  link.textContent = config.text;

  if (config.external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  content.appendChild(label);
  content.appendChild(link);
  item.appendChild(icon);
  item.appendChild(content);

  return item;
}

function createQrSection(): HTMLElement {
  const section = document.createElement('div');
  section.className = 'qr-section';

  const title = document.createElement('h3');
  title.textContent = i18n.t('contact.website');
  title.style.marginTop = '2rem';
  title.style.marginBottom = '1rem';
  section.appendChild(title);

  const image = document.createElement('img');
  image.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(WEBSITE_URL)}`;
  image.alt = 'Website QR Code';
  image.className = 'qr-code';
  image.style.border = '2px solid #ddd';
  image.style.borderRadius = '8px';
  image.style.padding = '10px';
  image.style.backgroundColor = 'white';
  section.appendChild(image);

  return section;
}

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

  contactList.appendChild(createContactItem({
    icon: '✉️',
    labelKey: 'contact.email',
    href: `mailto:${contact.email}`,
    text: contact.email,
  }));

  if (contact.phone) {
    contactList.appendChild(createContactItem({
      icon: '📞',
      labelKey: 'contact.phone',
      href: `tel:${contact.phone}`,
      text: contact.phone,
    }));
  }

  contactList.appendChild(createContactItem({
    icon: '🌐',
    labelKey: 'contact.website',
    href: WEBSITE_URL,
    text: WEBSITE_URL,
    external: true,
  }));

  container.appendChild(contactList);
  container.appendChild(createQrSection());

  main.appendChild(container);
}
