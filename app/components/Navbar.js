'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

/**
 * Navbar — Fixed top navigation with scroll shrink effect and mobile hamburger menu.
 */
export default function Navbar() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    // Navbar scroll effect — shrinks padding on scroll
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled')
        } else {
          navbar.classList.remove('scrolled')
        }
      }
    }
    window.addEventListener('scroll', handleScroll)

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle')
    const navLinks = document.querySelector('.nav-links')
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex'
        navLinks.style.position = 'absolute'
        navLinks.style.top = '100%'
        navLinks.style.left = '0'
        navLinks.style.right = '0'
        navLinks.style.flexDirection = 'column'
        navLinks.style.background = 'rgba(13, 13, 13, 0.98)'
        navLinks.style.padding = '20px'
        navLinks.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)'
      })
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav id="navbar">
      <div className="nav-container">
        <div className="logo">
          <Image src="/Emotion.png" alt="E-Motion Production" width={120} height={120} priority style={{ height: '120px', width: 'auto' }} />
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#clients">Clients</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}
