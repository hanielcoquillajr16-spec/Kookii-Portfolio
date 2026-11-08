import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { contactEmailLink, contactFormEndpoint } from '../data/profile';
import { Icon } from './Icon';

type SubmissionStatus = 'idle' | 'sending' | 'success' | 'error';

interface SubmissionResponse {
  success?: boolean;
  message?: string;
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [feedback, setFeedback] = useState(contactFormEndpoint ? 'All fields are required. Your email helps me reply.' : 'Messaging is temporarily unavailable. You can still use Email Me.');
  const submitting = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const isSending = status === 'sending';

  useEffect(() => () => activeRequest.current?.abort(), []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!contactFormEndpoint) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message) {
      setStatus('error');
      setFeedback('Please fill in your name, email address, and message.');
      return;
    }

    submitting.current = true;
    setStatus('sending');
    setFeedback('Sending your message…');
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const response = await fetch(contactFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name,
          email,
          message,
          _honey: String(data.get('_honey') ?? ''),
        }),
      });

      const result: SubmissionResponse | null = await response.json().catch(() => null);
      if (response.ok && result?.success === true) {
        setStatus('success');
        setFeedback('Thanks for reaching out! Your message has been submitted.');
        form.reset();
      } else {
        setStatus('error');
        setFeedback(response.status === 503
          ? 'Messaging is temporarily unavailable. Please use Email Me.'
          : response.status === 429
            ? 'Please wait a minute before sending another message.'
            : "Your message couldn't be sent. Please try again, or use Email Me.");
      }
    } catch {
      setStatus('error');
      setFeedback(controller.signal.aborted
        ? 'Sending took too long. Please try again, or use Email Me.'
        : "Couldn't connect to the message service. Please try again, or use Email Me.");
    } finally {
      clearTimeout(timeout);
      activeRequest.current = null;
      submitting.current = false;
    }
  }

  return <form className="contact-message-form" aria-labelledby="message-form-heading" aria-busy={isSending} onSubmit={submitMessage}>
    <div className="contact-form-heading"><Icon name="send" size={35} /><h3 id="message-form-heading">Send a Message</h3><span aria-hidden="true" /></div>
    <fieldset disabled={isSending || !contactFormEndpoint}>
      <legend className="sr-only">Your contact details and message</legend>
      <div className="contact-field-row">
        <label className="contact-field" htmlFor="contact-name">
          <Icon name="user" size={24} />
          <span className="contact-field-body"><span className="contact-field-label">Name <span aria-hidden="true">*</span></span><input id="contact-name" name="name" placeholder="Your name" autoComplete="name" maxLength={100} required /></span>
        </label>
        <label className="contact-field" htmlFor="contact-email">
          <Icon name="mail" size={25} />
          <span className="contact-field-body"><span className="contact-field-label">Email <span aria-hidden="true">*</span></span><input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required /></span>
        </label>
      </div>
      <label className="contact-field contact-message-field" htmlFor="contact-message">
        <Icon name="message" size={24} />
        <span className="contact-field-body"><span className="contact-field-label">Message <span aria-hidden="true">*</span></span><textarea id="contact-message" name="message" placeholder="Your message…" rows={5} maxLength={5000} required /></span>
      </label>
      <input className="contact-honeypot" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="contact-submit" type="submit" disabled={isSending || !contactFormEndpoint}><Icon name="send" size={23} />{isSending ? 'Sending…' : 'Send Message'}</button>
    </fieldset>
    <p className={`contact-form-feedback feedback-${status}`} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'}>
      {feedback}{(status === 'error' || !contactFormEndpoint) && <> <a href={contactEmailLink} target="_blank" rel="noopener noreferrer">Email Me<Icon name="arrow-up-right" size={11} /></a></>}
    </p>
  </form>;
}
