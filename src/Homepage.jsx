import { useEffect, useState } from 'react';
import { ArrowRight, List, X } from '@phosphor-icons/react';
import { Analytics } from '@vercel/analytics/react';
import { SentinelVisual } from './SentinelVisual.jsx';
import '@fontsource/libre-caslon-display/400.css';
import '@fontsource/libre-caslon-text/400.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';

const articles = [
  { title: 'Capability Is Not Authority', type: 'Research note', href: '/capability-is-not-authority/', description: 'A bounded experiment in AI authority, with the results and limitations made explicit.' },
  { title: 'Before You Give an AI Agent Authority', type: 'Practical framework', href: '/before-you-give-an-ai-agent-authority/', description: 'A readiness worksheet for defining permissions, oversight, and the evidence required before delegation.' },
  { title: 'Stop Starting with AI. Start with the Workflow.', type: 'Perspective', href: '/stop-starting-with-ai-start-with-the-workflow', description: 'Begin with how work actually moves, where judgment is needed, and what a useful improvement would mean.' },
];
const archive = [
  ['Agent Managers: The Next Layer of Human Oversight', '/agent-managers-human-oversight/'],
  ['The Work Did Not Become Smaller When the Uniform Came Off', '/translate-your-service'],
  ['Why Good Experience Becomes Invisible During a Job Search', '/career-recovery'],
  ['A Thought Partner Should Make Your Thinking Harder to Fool', '/thought-partner'],
  ['From RPA to Agentic AI: The New Control Problem — Part 2', '/from-rpa-to-agentic-ai-new-control-problem-part-2-capability-is-not-permission'],
  ['From RPA to Agentic AI: The New Control Problem — Part 1', '/from-rpa-to-agentic-ai-new-control-problem-part-1'],
  ['The Artificial Intelligence Fluency Premium Is Becoming the Real Jobs Story', '/ai-fluency-premium'],
  ['AI Is Not an Answer Machine. It Is a Test of Human Judgment.', '/ai-human-judgment-education'],
];
const Arrow = () => <ArrowRight aria-hidden="true" weight="regular" size={21} />;
export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const aliases = { insights: 'research', 'point-of-view': 'research', flagship: 'sentinel', impact: 'about', experience: 'about', 'selected-work': 'sentinel' };
    const scroll = () => { const id = decodeURIComponent(location.hash.slice(1)); document.getElementById(aliases[id] || id)?.scrollIntoView(); };
    scroll(); window.addEventListener('hashchange', scroll);
    return () => window.removeEventListener('hashchange', scroll);
  }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Juan Martinez home">JUAN MARTINEZ</a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={24}/> : <List size={24}/>}</button>
      <nav id="main-nav" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
        <a href="#research">Research</a><a href="#sentinel">Sentinel</a><a href="#about">About</a><a className="contact-nav" href="#contact">Contact</a>
      </nav>
    </header>
    <main id="main">
      <section id="top" className="hero-scene" aria-labelledby="hero-title">
        <SentinelVisual />
        <div className="hero"><div className="hero-copy">
          <p className="eyebrow">AI governance · Operational leadership</p>
          <h1 id="hero-title">The operating discipline<br className="desktop-break"/> behind accountable AI.</h1>
          <p className="hero-intro">My work brings operational leadership and independent risk oversight to the design of AI-enabled workflows. Through Sentinel, I examine where AI can improve performance and what evidence leaders need before expanding its authority.</p>
          <div className="hero-actions"><a className="button primary" href="#research">Read the research <Arrow/></a><a className="button secondary" href="#sentinel">Explore Sentinel <Arrow/></a></div>
          <article className="latest-research"><p className="eyebrow">Latest research</p><h2><a href={articles[0].href}>Capability Is Not Authority</a></h2><time dateTime="2026-09-20">20 September 2026</time><p>{articles[0].description}</p><a className="text-link" href={articles[0].href}>Read the article <Arrow/></a></article>
        </div></div>
        <div className="identity-strip"><div><p>Juan A. Martinez Diaz, MBA</p><span>Former Wells Fargo Vice President · Retired U.S. Army Sergeant Major</span></div><span className="identity-principles">People / Operations / Accountability</span></div>
      </section>
      <section id="research" className="content-section research-section" aria-labelledby="research-heading">
        <div className="section-intro"><p className="eyebrow">Research & practice</p><h2 id="research-heading">Evidence behind<br/>the argument.</h2><p>Writing on the design, authority, and operating conditions of AI-enabled work.</p></div>
        <div className="article-list">{articles.map((article, i) => <article key={article.title}><span className="article-number">0{i+1}</span><div><p className="eyebrow">{article.type}</p><h3><a href={article.href}>{article.title}</a></h3><p>{article.description}</p></div><a className="round-link" href={article.href} aria-label={'Read '+article.title}><Arrow/></a></article>)}<article className="field-guide-card"><span className="article-number">04</span><div><p className="eyebrow">Executive field guide · September 2026</p><h3><a href="/delegating-work-to-ai/">Delegating Work to AI</a></h3><p>Authority, evidence, and oversight: a practical guide with a worked Sentinel example, adapted from my executive education work.</p><a className="text-link" href="/delegating-work-to-ai/">Read the guide <Arrow/></a></div><a className="round-link" href="/downloads/delegating-work-to-ai.pdf" aria-label="Download Delegating Work to AI PDF"><Arrow/></a></article><details className="research-archive"><summary>More writing &amp; applied work</summary><ul>{archive.map(([title, href]) => <li key={href}><a href={href}>{title} <Arrow/></a></li>)}</ul><div className="archive-tools"><a href="/ai-build-lab">AI Build Lab</a><a href="/martinez-method">The M.A.R.T.I.N.E.Z. Method</a><a href="/?view=decision-xray">Decision X-Ray</a></div></details></div>
      </section>
      <section id="sentinel" className="content-section sentinel-section" aria-labelledby="sentinel-heading"><div className="section-intro"><p className="eyebrow">Applied work / Sentinel</p><h2 id="sentinel-heading">Discover.<br/>Improve.<br/>Prove.</h2></div><div className="section-body"><p className="section-lead">Sentinel discovers how work gets done, shows what should change and why, and measures whether the change actually helped.</p><p>My current work examines how to give AI a useful role in a workflow while making its authority explicit. The research uses bounded experiments and synthetic cases, with the limits of each result stated alongside it.</p><div className="principle-list"><div><span>01</span><p><strong>Understand the work.</strong> Trace the evidence, handoffs, and decisions before proposing automation.</p></div><div><span>02</span><p><strong>Define the authority.</strong> Specify what the agent can do, what requires approval, and when work must stop.</p></div><div><span>03</span><p><strong>Evaluate the whole result.</strong> Account for quality, review effort, rework, and control performance.</p></div></div><a className="text-link" href={articles[0].href}>Explore the published experiment <Arrow/></a><br/><a className="text-link" href="/delegating-work-to-ai/#worked-example">Read the worked Sentinel example <Arrow/></a></div></section>
      <section id="about" className="content-section about-section" aria-labelledby="about-heading"><div className="section-intro"><p className="eyebrow">About Juan</p><h2 id="about-heading">Leadership with<br/>operating context.</h2></div><div className="section-body"><p className="section-lead">My perspective draws on operational leadership in the U.S. Army and independent technology and information security risk oversight in financial services.</p><p>I am a former Wells Fargo Vice President and a retired U.S. Army Sergeant Major, with an MBA from Wake Forest University. My independent work brings that experience to the practical questions of AI governance: who owns the decision, what evidence supports it, and how the organization responds when the system is wrong.</p><a className="text-link" href="/martinez-method">Read the working method <Arrow/></a></div></section>
      <section id="contact" className="contact-section" aria-labelledby="contact-heading"><p className="eyebrow">Editorial inquiries & professional conversations</p><h2 id="contact-heading">Let’s examine the work.</h2><p>For writing, research, or a conversation about a workflow you are evaluating.</p><a className="button primary" href="mailto:sgmmartinez@gmail.com">Contact Juan <Arrow/></a><p className="contact-secondary"><a href="https://www.linkedin.com/in/juan-a-martinez-diaz-50943411">LinkedIn profile</a></p></section>
    </main>
    <footer className="site-footer"><span>Juan A. Martinez Diaz, MBA</span><span>Independent work · Views are my own.</span><a href="#top">Back to top</a></footer>
    <Analytics />
  </>;
}
