'use client'

import { useEffect, useRef } from 'react'

/**
 * QuoteModal — Full-screen modal with detailed quote request form.
 * @param {boolean} isOpen   - Whether the modal is visible
 * @param {Function} onClose - Callback to close the modal
 * @param {Function} onSuccess - Callback fired after successful form submission
 */
export default function QuoteModal({ isOpen, onClose, onSuccess }) {
  const modalRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    const modal = modalRef.current
    if (!modal) return

    function handleOutsideClick(e) {
      if (e.target === modal) {
        onClose()
      }
    }
    modal.addEventListener('click', handleOutsideClick)
    return () => modal.removeEventListener('click', handleOutsideClick)
  }, [onClose])

  function handleQuoteSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)
    const services = []
    event.target.querySelectorAll('input[name="services"]:checked').forEach(checkbox => {
      services.push(checkbox.value)
    })
    data.services = services

    if (services.length === 0) {
      alert('Please select at least one service.')
      return
    }

    console.log('Quote form submitted:', data)
    onClose()
    onSuccess()
    event.target.reset()
  }

  return (
    <div
      className={`quote-modal${isOpen ? ' active' : ''}`}
      id="quoteModal"
      ref={modalRef}
    >
      <div className="quote-form-container">
        <div className="close-modal" onClick={onClose}>×</div>
        <h2>Request a Free Quote</h2>
        <p>Tell us about your project and we&apos;ll get back to you within 24 hours</p>
        <form onSubmit={handleQuoteSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quote-name">Full Name *</label>
              <input type="text" id="quote-name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="quote-company">Company Name</label>
              <input type="text" id="quote-company" name="company" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quote-email">Email *</label>
              <input type="email" id="quote-email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="quote-phone">Phone *</label>
              <input type="tel" id="quote-phone" name="phone" required />
            </div>
          </div>
          <div className="form-group">
            <label>Services Required *</label>
            <div className="service-checkboxes">
              <div className="service-checkbox">
                <input type="checkbox" id="service-video" name="services" value="video-production" />
                <label htmlFor="service-video">Video Production</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-voice" name="services" value="voice-over" />
                <label htmlFor="service-voice">Voice Over/Dubbing</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-animation" name="services" value="animation" />
                <label htmlFor="service-animation">Animation</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-music" name="services" value="music" />
                <label htmlFor="service-music">Music/Sound Design</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-concept" name="services" value="conceptualization" />
                <label htmlFor="service-concept">Creative Concept</label>
              </div>
              <div className="service-checkbox">
                <input type="checkbox" id="service-post" name="services" value="post-production" />
                <label htmlFor="service-post">Post-Production</label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="quote-budget">Budget Range</label>
            <select id="quote-budget" name="budget">
              <option value="">Select Budget Range</option>
              <option value="under-50k">Under ₹50,000</option>
              <option value="50k-1l">₹50,000 - ₹1,00,000</option>
              <option value="1l-5l">₹1,00,000 - ₹5,00,000</option>
              <option value="5l-10l">₹5,00,000 - ₹10,00,000</option>
              <option value="above-10l">Above ₹10,00,000</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quote-timeline">Project Timeline</label>
            <select id="quote-timeline" name="timeline">
              <option value="">Select Timeline</option>
              <option value="urgent">Urgent (Within 1 week)</option>
              <option value="2-weeks">2 Weeks</option>
              <option value="1-month">1 Month</option>
              <option value="2-months">2 Months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quote-details">Project Details *</label>
            <textarea id="quote-details" name="details" rows={5} required placeholder="Tell us about your project, goals, and any specific requirements..."></textarea>
          </div>
          <div className="checkbox-group">
            <input type="checkbox" id="quote-newsletter" name="newsletter" />
            <label htmlFor="quote-newsletter">Subscribe to our newsletter for creative tips and updates</label>
          </div>
          <button type="submit" className="btn btn-primary">Submit Quote Request</button>
        </form>
      </div>
    </div>
  )
}
