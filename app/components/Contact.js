'use client'

import { useState } from 'react'
import RotaryPhone from './RotaryPhone'

const WEB3FORMS_KEY = 'd7b43c78-5b65-4e5e-a8ff-67b77f4331f7'

/**
 * Contact — Contact info sidebar + message form.
 * @param {Function} onSuccess - Callback fired after successful form submission
 */
export default function Contact({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleContactSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const formData = new FormData(event.target)
      formData.append('access_key', WEB3FORMS_KEY)
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error('Submission failed')
      event.target.reset()
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="section-header animate-on-scroll">
        <h2>Let&apos;s Create Together</h2>
        <p>Ready to bring your vision to life? Get in touch with our team</p>
      </div>
      <RotaryPhone />
      <div className="contact-content">
        <div className="contact-info animate-on-scroll">
          <h3>Get In Touch</h3>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <h4>Visit Us</h4>
              <p>Mumbai, Maharashtra, India</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <h4>Call Us</h4>
              <p>+91 98206 36736</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div>
              <h4>Email Us</h4>
              <p>hi@emotionproduction.in</p>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🕒</div>
            <div>
              <h4>Working Hours</h4>
              <p>Mon - Sat: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
        <form className="contact-form animate-on-scroll" id="contactForm" onSubmit={handleContactSubmit}>
          <h3>Send Message</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" name="email" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Request</label>
              <input type="text" id="subject" name="subject" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
