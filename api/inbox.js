document.addEventListener('DOMContentLoaded', async () => {
  const currentUser = localStorage.getItem('username');

  if (!currentUser) {
    // No user logged in — send them to the login page
    window.location.href = 'login.html';
    return;
  }

  const inboxContainer = document.getElementById('inbox');
  inboxContainer.innerHTML = '<p>Loading messages...</p>';

  try {
    const res = await fetch(`/api/get_emails?recipient=${encodeURIComponent(currentUser)}`);
    if (!res.ok) throw new Error('Failed to fetch emails');

    const emails = await res.json();
    inboxContainer.innerHTML = '';

    if (!emails || emails.length === 0) {
      inboxContainer.innerHTML = '<p>No messages in your inbox.</p>';
      return;
    }

    emails.forEach(email => {
      const item = document.createElement('div');
      item.classList.add('email-item');
      item.innerHTML = `
        <div class="email-header">
          <strong>${email.subject}</strong>
          <span class="timestamp">${new Date(email.timestamp).toLocaleString()}</span>
        </div>
        <div class="email-meta">
          From: ${email.sender}
        </div>
        <div class="email-preview">
          ${email.body.length > 100 ? email.body.slice(0, 100) + '…' : email.body}
        </div>
      `;

      item.addEventListener('click', () => {
        alert(
          `From: ${email.sender}\n` +
          `To: ${email.recipient}\n` +
          `Subject: ${email.subject}\n\n${email.body}`
        );
      });

      inboxContainer.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    inboxContainer.innerHTML = '<p>Error loading inbox. Please try again later.</p>';
  }
});
