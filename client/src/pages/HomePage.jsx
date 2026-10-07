import { Link } from 'react-router-dom'
import './HomePage.scss'

const YOURS = [
    'Describe the issue and send it.',
    'Change the details while it is open or in progress.',
    'Delete it only while it is still open.',
    'Come back to see every request you have sent.',
]

const THEIRS = [
    'Read the request.',
    'Move it to in progress when the work starts.',
    'Mark it resolved when the work is finished.',
    'Leave a resolved request as it is.',
]

const STEPS = [
    { title: 'Describe it', text: 'Say what is wrong, pick a category, and set how urgent it feels.' },
    { title: 'They pick it up', text: 'It stays open until someone starts, then it moves to in progress.' },
    { title: 'It is resolved', text: 'Finished work stays resolved, so the record is easy to follow.' },
]

const CATEGORIES = [
    { title: 'IT', text: 'Printers, access, and software.' },
    { title: 'Maintenance', text: 'Rooms, furniture, and facilities.' },
    { title: 'General', text: 'Anything else that needs a team.' },
]

const PRIORITIES = [
    { title: 'Low', text: 'This can wait.' },
    { title: 'Medium', text: 'This needs attention soon.' },
    { title: 'High', text: 'This is blocking work.' },
]

export default function HomePage() {
    return (
        <section className="home">
            <header className="home-intro">
                <h1>Service Request Management</h1>
                <p>
                    A centralized platform for managing workplace service requests efficiently.
                    Users can create and submit requests, provide details about the issue, set its priority,
                    and track the request throughout its lifecycle. Requests can be monitored from <strong>Open</strong> to <strong>In Progress</strong> and <strong>Resolved</strong>,
                    ensuring that every request is organized and easy to follow.
                </p>
                <p className="home-admin">
                    Administrators can manage all submitted requests, update their status,
                    and oversee the overall request workflow from a single dashboard.
                </p>
                <div className="home-actions">
                    <Link className="button primary" to="/requests/new">New request</Link>
                    <Link className="button secondary" to="/requests">My requests</Link>
                </div>
            </header>

            <section className="home-split" aria-label="Who does what">
                <article>
                    <h2>What you do</h2>
                    <ul>
                        {YOURS.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </article>
                <article>
                    <h2>What the team does</h2>
                    <ul>
                        {THEIRS.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                </article>
            </section>

            <section className="home-block">
                <h2>How a request moves</h2>
                <ol className="home-steps">
                    {STEPS.map((step, index) => (
                        <li key={step.title}>
                            <span className="home-step-index">{index + 1}</span>
                            <strong>{step.title}</strong>
                            <span>{step.text}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="home-band">
                <h2>What you can ask for</h2>
                <div className="home-band-row">
                    {CATEGORIES.map((item) => (
                        <p key={item.title}>
                            <strong>{item.title}</strong>
                            <span>{item.text}</span>
                        </p>
                    ))}
                </div>
            </section>

            <section className="home-block">
                <h2>How to choose priority</h2>
                <div className="home-scale">
                    {PRIORITIES.map((item) => (
                        <p key={item.title}>
                            <strong>{item.title}</strong>
                            <span>{item.text}</span>
                        </p>
                    ))}
                </div>
                <p className="home-note">Priority is how urgent it feels to you. Status is what the team has done.</p>
            </section>
        </section>
    )
}
