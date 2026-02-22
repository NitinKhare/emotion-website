'use client'

/**
 * Team — Team member cards with photos and bios.
 */
export default function Team() {
  return (
    <section className="team" id="team">
      <div className="section-header animate-on-scroll">
        <h2>Meet Our Creative Team</h2>
        <p>Passionate professionals dedicated to bringing your vision to life</p>
      </div>
      <div className="team-grid">
        <div className="team-member animate-on-scroll">
          <div className="member-photo">
            <img src="https://emotionproduction.in/wp-content/uploads/2019/12/0.jpg" alt="Homiyar Sachinwala" />
          </div>
          <h3>Homiyar Sachinwala</h3>
          <p>26 years of experience in advertising, sales, and client servicing. Expert in creative direction, script writing, and voice-over artistry.</p>
        </div>
        <div className="team-member animate-on-scroll">
          <div className="member-photo">
            <img src="https://emotionproduction.in/wp-content/uploads/2024/12/sakshi-959x1024.jpg" alt="Sakshi Shreya" />
          </div>
          <h3>Sakshi Shreya</h3>
          <p>Award-winning voice-over artist and playback singer with 1000+ jingles recorded. Honored with the &quot;Pride of Ranchi&quot; award.</p>
        </div>
      </div>
    </section>
  )
}
