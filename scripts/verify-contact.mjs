import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const base = process.argv[2] || process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
  const requests = [];
  let responseMode = 'pending';
  let releaseResponse;
  await page.route('**/api/contact', async route => {
    if (route.request().method() !== 'POST') throw new Error('Expected a POST request');
    requests.push({ url: route.request().url(), ...route.request().postDataJSON() });
    if (responseMode === 'pending') await new Promise(resolve => { releaseResponse = resolve; });
    if (responseMode === 'network-error') return route.abort('failed');
    const result = responseMode === 'unavailable'
      ? { success: false, message: 'Messaging is temporarily unavailable.' }
      : responseMode === 'rejected'
        ? { success: false, message: 'Unable to submit form.' }
        : { success: true, id: 'test-email-id' };
    await route.fulfill({ status: responseMode === 'unavailable' ? 503 : 200, contentType: 'application/json', body: JSON.stringify(result) });
  });

  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#main-navigation a[href="#contact"]').click();
  const emailCard = page.locator('.contact-cards').getByRole('link', { name: /Email Me/ });
  assert.equal(await emailCard.getAttribute('href'), 'https://formsubmit.co/el/pokobu');
  assert.equal(await emailCard.getAttribute('target'), '_blank');
  const form = page.getByRole('form', { name: 'Send a Message' });
  const name = form.getByRole('textbox', { name: /^Name/ });
  const email = form.getByRole('textbox', { name: /^Email/ });
  const message = form.getByRole('textbox', { name: /^Message/ });
  const submit = form.getByRole('button', { name: 'Send Message', exact: true });
  if (process.argv.includes('--unconfigured')) {
    assert.ok(await submit.isDisabled(), 'An unconfigured production form cannot pretend to send');
    assert.equal(await form.getByRole('link', { name: 'Email Me' }).getAttribute('href'), 'https://formsubmit.co/el/pokobu');
    console.log('PASS unconfigured production form is disabled and provides a working fallback');
  } else {
  const fixture = { name: 'Portfolio visitor', email: 'visitor@example.com', message: 'I would like to discuss a web development project.' };
  const fill = async () => {
    await name.fill(`  ${fixture.name}  `);
    await email.fill(fixture.email);
    await message.fill(fixture.message);
  };

  await submit.click();
  assert.equal(requests.length, 0, 'Empty form does not submit');
  await fill();
  await email.fill('invalid-email');
  await submit.click();
  assert.equal(requests.length, 0, 'Invalid email does not submit');
  await email.fill(fixture.email);
  await submit.click();
  await form.getByRole('button', { name: /Sending/ }).waitFor();
  assert.ok(await name.isDisabled(), 'Inputs are disabled while sending');
  await form.evaluate(element => element.requestSubmit());
  assert.equal(requests.length, 1, 'Repeated submissions do not create another request');
  assert.equal(new URL(requests[0].url).pathname, '/api/contact');
  assert.equal(requests[0].name, fixture.name, 'Name is trimmed');
  assert.equal(requests[0].email, fixture.email);
  assert.equal(requests[0]._replyto, undefined, 'Reply-To is set by the backend');
  assert.equal(requests[0].message, fixture.message);
  assert.ok(releaseResponse, 'Pending response is intercepted');
  responseMode = 'success';
  releaseResponse();
  await form.locator('.feedback-success').waitFor();
  assert.equal(await name.inputValue(), '', 'Successful submission clears the form');
  assert.equal(await message.inputValue(), '');
  console.log('PASS required fields, email validation, backend request, payload, duplicate prevention, success');

  responseMode = 'unavailable';
  await fill();
  await submit.click();
  await form.getByText('Messaging is temporarily unavailable.', { exact: false }).waitFor();
  assert.equal(await message.inputValue(), fixture.message, 'Unavailable backend keeps the entered message');
  assert.equal(await form.locator('.feedback-success').count(), 0, 'Unavailable backend is not reported as success');
  assert.equal(await form.getByRole('link', { name: 'Email Me' }).getAttribute('href'), 'https://formsubmit.co/el/pokobu');
  assert.equal(await form.getByRole('link', { name: 'Email Me' }).getAttribute('target'), '_blank');
  console.log('PASS missing backend configuration feedback and email fallback');

  responseMode = 'rejected';
  await submit.click();
  await form.getByText("Your message couldn't be sent.", { exact: false }).waitFor();
  assert.equal(await message.inputValue(), fixture.message, 'Service rejection keeps the message');
  assert.ok(await submit.isEnabled(), 'Service rejection allows retry');
  console.log('PASS HTTP 200 with success=false is treated as a failure');

  responseMode = 'network-error';
  await submit.click();
  await form.getByText("Couldn't connect to the message service.", { exact: false }).waitFor();
  assert.equal(await message.inputValue(), fixture.message, 'Connection errors keep the message');
  assert.ok(await submit.isEnabled(), 'Connection error allows retry');
  console.log('PASS connection error and message preservation');

  responseMode = 'boolean-success';
  await submit.click();
  await form.locator('.feedback-success').waitFor();
  assert.equal(await message.inputValue(), '', 'Retry succeeds with boolean success response');
  console.log('PASS retry and boolean success; all delivery requests were mocked, no emails sent');
  }
} finally {
  await browser.close();
}
