'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

/* ─── Starters by Gender ─── */
const STARTERS_FEMALE = [
  { icon: '💫', text: "He hasn't texted back in 2 days... what do I do?" },
  { icon: '🔍', text: 'Analyze my situation for red & green flags' },
  { icon: '✨', text: 'How do I become more magnetic and alluring?' },
  { icon: '💔', text: 'I keep attracting the wrong type of men' },
  { icon: '🪞', text: "I don't feel confident enough to date" },
  { icon: '🔥', text: 'How do I reignite the spark in my relationship?' },
];

const STARTERS_MALE = [
  { icon: '💬', text: "She's gone cold after a great first date — what happened?" },
  { icon: '🔍', text: 'Analyze my situation for red & green flags' },
  { icon: '🧲', text: 'What do women actually find attractive?' },
  { icon: '💔', text: 'I keep getting friendzoned — what am I doing wrong?' },
  { icon: '🪞', text: "I want to be more confident around women" },
  { icon: '🔥', text: 'How do I deepen the connection with my partner?' },
];

/* ─── Quiz Data ─── */
const ENERGY_QUIZ = [
  { q: 'At a social gathering, you naturally tend to...', opts: [
    { text: 'Make everyone feel welcome and included', arch: 'warm' },
    { text: 'Have one or two deep conversations in a corner', arch: 'storm' },
    { text: "Bring the energy — you're the one telling stories", arch: 'spark' },
    { text: 'Be the calm, steady presence people gravitate toward', arch: 'anchor' },
    { text: 'Observe from a distance, drawing curious glances', arch: 'enigma' },
  ]},
  { q: "When someone you're dating pulls away slightly, your instinct is to...", opts: [
    { text: "Reach out warmly to make sure they're okay", arch: 'warm' },
    { text: 'Feel it deeply but not show it outwardly', arch: 'storm' },
    { text: 'Distract yourself with friends and activities', arch: 'spark' },
    { text: 'Give them space and trust the process', arch: 'anchor' },
    { text: 'Mirror their energy and focus on your own world', arch: 'enigma' },
  ]},
  { q: 'Your friends would say your greatest strength is...', opts: [
    { text: 'Your ability to make anyone feel safe and heard', arch: 'warm' },
    { text: 'Your depth — you think and feel on another level', arch: 'storm' },
    { text: 'Your infectious energy that lights up any room', arch: 'spark' },
    { text: "Your reliability — you're the rock everyone depends on", arch: 'anchor' },
    { text: "Your mystique — people are always trying to figure you out", arch: 'enigma' },
  ]},
  { q: 'In a romantic relationship, you express love by...', opts: [
    { text: 'Creating a nurturing, cozy atmosphere of care', arch: 'warm' },
    { text: 'Sharing your innermost thoughts and emotions', arch: 'storm' },
    { text: 'Planning adventures and keeping things exciting', arch: 'spark' },
    { text: 'Being consistently present and dependable', arch: 'anchor' },
    { text: 'Surprising them — they never quite know what\'s next', arch: 'enigma' },
  ]},
  { q: "When you're at your most confident, you feel...", opts: [
    { text: "Connected — like you're radiating warmth to everyone", arch: 'warm' },
    { text: "Powerful — like there's a fire burning quietly inside", arch: 'storm' },
    { text: 'Electric — like you could charm anyone in the room', arch: 'spark' },
    { text: 'Unshakeable — like nothing could knock you off center', arch: 'anchor' },
    { text: "Magnetic — like people can't quite look away", arch: 'enigma' },
  ]},
];

const ARCHETYPE_DATA = {
  warm: { name: 'The Warm Light', emoji: '🌸', color: '#E8919A', gradient: 'linear-gradient(135deg, #E8919A, #F4C2C2)', tagline: 'You make people feel safe just by being near', desc: 'Your allure lives in your warmth. People are drawn to you because you create a space where they feel genuinely seen and cared for. In a cold world, your light is magnetic.', strength: 'Approachability, emotional safety, deep empathy', growth: "Setting boundaries so your warmth isn't depleted. Remember: you don't explain your boundaries — a boundary is not a negotiation.", allureCode: 'Your Invisible Thread radiates safety and acceptance. Master the Mystery Principle to add depth to your warmth — let people discover your layers rather than giving everything at once.' },
  storm: { name: 'The Quiet Storm', emoji: '🌊', color: '#6B7DB3', gradient: 'linear-gradient(135deg, #6B7DB3, #A8B8D8)', tagline: 'Still waters run deep — and everyone senses it', desc: "Your allure is your intensity. Beneath your calm exterior, people sense something powerful, complex, and fascinating. You embody the Confidence Paradox — your quiet is louder than most people's noise.", strength: 'Depth, emotional intensity, natural mystery', growth: "Letting people in. Your growth edge is vulnerability — the most confident people can say 'I don't know' without it threatening their identity.", allureCode: "You naturally master the Mystery Principle — people are fascinated by what they can't fully understand about you. Now focus on Emotional Magnetism: let your empathic attunement show more openly." },
  spark: { name: 'The Spark', emoji: '⚡', color: '#E8A838', gradient: 'linear-gradient(135deg, #E8A838, #F5D280)', tagline: 'You walk in, and the energy in the room shifts', desc: 'Your allure is your radiance. You bring life, laughter, and electricity to every space you enter. People are drawn to your energy because it feels like sunshine after a grey week.', strength: 'Charisma, spontaneity, infectious positivity', growth: 'Learning the Art of Presence through stillness. The Pause Before Speaking will transform your connections — let silence breathe in conversation.', allureCode: 'Your visible allure is powerful, but your Invisible Thread could use attention. Practice Purposeful Eye Contact and the Slow Turn. When you combine your natural energy with intentional presence, you become unforgettable.' },
  anchor: { name: 'The Anchor', emoji: '⚓', color: '#5B8A72', gradient: 'linear-gradient(135deg, #5B8A72, #A8D5BA)', tagline: 'In a chaotic world, you are the calm everyone craves', desc: "Your allure is your groundedness. In a world of chaos and reactivity, your steady presence is deeply attractive. You embody Emotional Regulation — the ability to stay calm when others are reactive.", strength: 'Reliability, emotional stability, trustworthiness', growth: "Adding spontaneity and playfulness. Your Energy Signature could benefit from moments of unexpected warmth — surprise the people around you sometimes.", allureCode: "You've mastered the High-Value Mindset naturally — you invest where you're invested in. Now lean into the Confidence Paradox: show your full emotional range. The most magnetic people can be tender AND fierce." },
  enigma: { name: 'The Enigma', emoji: '🔮', color: '#8B6BAE', gradient: 'linear-gradient(135deg, #8B6BAE, #C4A8D8)', tagline: "They can't stop thinking about you — and they don't know why", desc: "Your allure is your mystery. You naturally embody what most people have to learn — the power of what you withhold. Curiosity about you activates dopamine in others' brains.", strength: 'Mystique, independence, natural selectivity', growth: "Vulnerability. Letting select people truly know you. Remember: allure isn't about being unreachable — it's about being worth reaching.", allureCode: "You're a living embodiment of the Mystery Principle. Your next level is mastering Empathic Attunement — when you combine your natural mystery with genuine emotional connection, you become truly irresistible." },
};

const ALLURE_QUIZ = [
  { q: "When they don't text back for hours, your first instinct is...", opts: [
    { text: 'Send another message to check in', score: 2 },
    { text: "Assume they're busy and focus on your own day", score: 5 },
    { text: 'Check their social media for clues', score: 1 },
    { text: 'Feel annoyed but keep yourself distracted', score: 3 },
  ]},
  { q: 'Someone crosses a boundary. You typically...', opts: [
    { text: 'Let it slide to avoid conflict', score: 1 },
    { text: 'State your boundary clearly and calmly', score: 5 },
    { text: 'Get upset and react emotionally', score: 2 },
    { text: 'Pull away silently without explaining', score: 2 },
  ]},
  { q: 'On social media, you tend to...', opts: [
    { text: 'Share everything — stories, thoughts, daily life', score: 1 },
    { text: 'Post selectively, leaving gaps that spark curiosity', score: 5 },
    { text: "Barely post, but consume everyone else's content", score: 3 },
    { text: 'Post based on impulse and mood', score: 2 },
  ]},
  { q: 'Your relationship with your own worth is...', opts: [
    { text: "Rock solid — I don't tolerate less than I deserve", score: 5 },
    { text: 'Strong but shaky when someone I like pulls away', score: 3 },
    { text: 'It depends on how my relationships are going', score: 1 },
    { text: "Growing — I'm learning but still people-please sometimes", score: 2 },
  ]},
  { q: 'In conversations, you tend to...', opts: [
    { text: 'Listen fully, pause, then respond thoughtfully', score: 5 },
    { text: 'Think about what to say next while they talk', score: 2 },
    { text: 'Rush to fill every silence', score: 1 },
    { text: 'Listen well but rarely share your own depth', score: 3 },
  ]},
  { q: 'When it comes to dating, you believe...', opts: [
    { text: 'I attract what I am, not what I want', score: 5 },
    { text: 'I need to be more attractive to find the right person', score: 1 },
    { text: 'The right person will appreciate me as I am', score: 4 },
    { text: "I'm not sure what I'm doing wrong honestly", score: 2 },
  ]},
];

const getScoreResult = (pct) => {
  if (pct >= 80) return { level: 'Magnetic', color: '#8B6BAE', desc: "You've cracked the code. Your Invisible Thread is strong — you radiate confidence, boundaries, and presence. Keep refining. Mastery is a practice, not a destination." };
  if (pct >= 60) return { level: 'Rising', color: '#E8A838', desc: "You're awakening to your power. The foundations are there — confidence, some boundaries, growing self-worth. Your next level is mastering consistency. The Allure Code's 21-Day Reset would accelerate your transformation." };
  if (pct >= 40) return { level: 'Awakening', color: '#E8919A', desc: "You're becoming aware of the patterns that dim your glow. That awareness is everything — it's where transformation begins. Focus on the High-Value Mindset and the Confidence Paradox." };
  return { level: 'Chrysalis', color: '#6B7DB3', desc: "You're in a cocoon right now — and that's not a bad thing. Something beautiful is forming. Old patterns are ready to be shed. The Allure Code was written for exactly this moment in your journey." };
};

/* ─── Components ─── */
const VCIcon = ({ size = 34, fontSize = 11, rounded = false }) => (
  <div style={{ width: size, height: size, borderRadius: rounded ? size * 0.35 : '50%', background: 'linear-gradient(135deg, #3D2B45, #6B4F7A, #8B6BAE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: size > 40 ? '0 6px 24px rgba(107,79,122,0.2)' : 'none' }}>
    <span style={{ fontSize, color: '#E8D4F0', fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: '-0.5px' }}>VC</span>
  </div>
);

const TypingDots = () => (
  <div style={{ display: 'flex', gap: 8, padding: '12px 0', alignItems: 'center' }}>
    <VCIcon />
    <div style={{ background: 'rgba(107,79,122,0.1)', borderRadius: '20px 20px 20px 4px', padding: '14px 22px', display: 'flex', gap: 6 }}>
      {[0, 1, 2].map(i => (<div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(107,79,122,0.4)', animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }} />))}
    </div>
  </div>
);

const Bubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '3px 0', animation: 'fadeIn 0.3s ease-out' }}>
      {!isUser && <div style={{ marginTop: 4 }}><VCIcon /></div>}
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'linear-gradient(135deg, #6B4F7A, #8B6BAE)' : 'rgba(107,79,122,0.08)',
        color: isUser ? '#FFF' : '#2D1B33',
        borderRadius: isUser ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
        padding: '14px 20px', fontSize: 14.5, lineHeight: 1.65, whiteSpace: 'pre-wrap',
        boxShadow: isUser ? '0 3px 14px rgba(107,79,122,0.2)' : 'none',
      }}>{msg.content}</div>
    </div>
  );
};

/* ─── Gender Selector ─── */
const GenderSelector = ({ onSelect }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn 0.6s ease-out' }}>
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><VCIcon size={80} fontSize={30} rounded /></div>
    <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 600, color: '#2D1B33', marginBottom: 6, textAlign: 'center' }}>VenusCoach</h1>
    <p style={{ fontSize: 14, color: '#9B8BA5', marginBottom: 6, textAlign: 'center' }}>by Elina Allegroni · The Allure Code</p>
    <p style={{ fontSize: 15, color: '#5A4D63', marginBottom: 36, textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}>AI-powered relationship coaching rooted in attraction psychology</p>
    <p style={{ fontSize: 16, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: '#2D1B33', marginBottom: 20 }}>I&apos;m here as...</p>
    <div style={{ display: 'flex', gap: 16, maxWidth: 400, width: '100%' }}>
      {[{ g: 'female', icon: '♀', label: 'A Woman', desc: 'Unlock your feminine allure & magnetic energy' }, { g: 'male', icon: '♂', label: 'A Man', desc: 'Learn what women actually notice & value' }].map(o => (
        <button key={o.g} onClick={() => onSelect(o.g)} style={{ flex: 1, padding: '28px 16px', border: '2px solid rgba(107,79,122,0.12)', borderRadius: 24, background: '#FFF', cursor: 'pointer', transition: 'all 0.3s', fontFamily: 'inherit', textAlign: 'center', boxShadow: '0 4px 20px rgba(107,79,122,0.06)' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B6BAE'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,79,122,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(107,79,122,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(107,79,122,0.06)'; }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{o.icon}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: '#2D1B33', marginBottom: 4 }}>{o.label}</div>
          <div style={{ fontSize: 12.5, color: '#9B8BA5', lineHeight: 1.4 }}>{o.desc}</div>
        </button>
      ))}
    </div>
    <p style={{ fontSize: 11, color: '#B5A8BF', marginTop: 24 }}>AI coach · not a substitute for therapy</p>
  </div>
);

/* ─── Main App ─── */
export default function VenusCoachApp() {
  const [gender, setGender] = useState(null);
  const [tab, setTab] = useState('coach');
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [eStep, setEStep] = useState(0);
  const [eTally, setETally] = useState({});
  const [eResult, setEResult] = useState(null);
  const [aStep, setAStep] = useState(0);
  const [aScores, setAScores] = useState([]);
  const [aResult, setAResult] = useState(null);

  const endRef = useRef(null);
  const scroll = useCallback(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), []);
  useEffect(() => { scroll(); }, [msgs, loading, scroll]);

  const starters = gender === 'male' ? STARTERS_MALE : STARTERS_FEMALE;
  const welcomeGreeting = gender === 'male' ? 'Hey there' : 'Hey gorgeous';
  const welcomeText = gender === 'male'
    ? "I\u2019m Venus, your AI relationship coach powered by The Allure Code. Let\u2019s talk about what\u2019s really going on."
    : "I\u2019m Venus, your AI relationship coach powered by The Allure Code. Tell me what\u2019s on your heart.";

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput('');
    setShowWelcome(false);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs.map(m => ({ role: m.role, content: m.content })), gender }),
      });
      const data = await res.json();
      const fallback = gender === 'male' ? "I\u2019m here for you. Tell me a little more about what\u2019s going on." : "I\u2019m here for you, love. Tell me a little more about what\u2019s going on.";
      const reply = data.content?.[0]?.text || fallback;
      setMsgs(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: "Something flickered on my end \u2014 try again in a moment. I\u2019m not going anywhere. \u2640" }]);
    }
    setLoading(false);
  };

  const handleEQuiz = (arch) => { const n = { ...eTally, [arch]: (eTally[arch] || 0) + 1 }; setETally(n); if (eStep < ENERGY_QUIZ.length - 1) setEStep(eStep + 1); else setEResult(Object.entries(n).sort((a, b) => b[1] - a[1])[0][0]); };
  const handleAQuiz = (score) => { const n = [...aScores, score]; setAScores(n); if (aStep < ALLURE_QUIZ.length - 1) setAStep(aStep + 1); else setAResult(Math.round((n.reduce((a, b) => a + b, 0) / (ALLURE_QUIZ.length * 5)) * 100)); };

  if (!gender) return <GenderSelector onSelect={setGender} />;

  const tabStyle = (id) => ({ flex: 1, padding: '9px 4px', border: 'none', borderRadius: 10, background: tab === id ? '#FFF' : 'transparent', color: tab === id ? '#2D1B33' : '#9B8BA5', fontSize: 12.5, fontWeight: tab === id ? 600 : 400, cursor: 'pointer', transition: 'all 0.25s', boxShadow: tab === id ? '0 2px 10px rgba(107,79,122,0.08)' : 'none', fontFamily: 'inherit', letterSpacing: '0.01em' });
  const quizOptStyle = { padding: '13px 16px', border: '1.5px solid rgba(107,79,122,0.1)', borderRadius: 14, background: '#FFF', cursor: 'pointer', fontSize: 13.5, color: '#2D1B33', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit', lineHeight: 1.4, width: '100%' };
  const ctaStyle = { width: '100%', padding: '14px', border: 'none', borderRadius: 14, background: 'linear-gradient(135deg, #6B4F7A, #8B6BAE)', color: '#FFF', fontSize: 14.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(107,79,122,0.2)', letterSpacing: '0.02em' };
  const retakeStyle = { padding: '14px 18px', border: '1.5px solid rgba(107,79,122,0.12)', borderRadius: 14, background: '#FFF', color: '#6B4F7A', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px 10px', background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(107,79,122,0.06)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <VCIcon size={44} fontSize={16} rounded />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 600, color: '#2D1B33', letterSpacing: '-0.3px' }}>VenusCoach</div>
              <div style={{ fontSize: 11.5, color: '#9B8BA5', fontWeight: 400, letterSpacing: '0.02em' }}>by Elina Allegroni · The Allure Code</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={() => { setGender(null); setMsgs([]); setShowWelcome(true); setTab('coach'); setEStep(0); setETally({}); setEResult(null); setAStep(0); setAScores([]); setAResult(null); }} style={{ fontSize: 10, background: 'rgba(107,79,122,0.06)', color: '#9B8BA5', padding: '4px 10px', borderRadius: 20, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{gender === 'female' ? '♀' : '♂'} Switch</button>
              <div style={{ fontSize: 10, background: 'linear-gradient(135deg, #6B4F7A, #8B6BAE)', color: '#FFF', padding: '4px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: '0.05em' }}>BETA</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3, background: 'rgba(107,79,122,0.05)', borderRadius: 12, padding: 3 }}>
            {[{ id: 'coach', label: 'Coach', icon: '💬' }, { id: 'analyze', label: 'Analyze', icon: '🔍' }, { id: 'energy', label: 'Energy Type', icon: '⚡' }, { id: 'score', label: 'Allure Score', icon: '✨' }].map(t => <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(t.id)}>{t.icon} {t.label}</button>)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 520, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>
        {tab === 'coach' && <>
          <div style={{ flex: 1, padding: '14px 16px 0', overflowY: 'auto' }}>
            {showWelcome && msgs.length === 0 && (
              <div style={{ animation: 'fadeIn 0.5s ease-out', paddingTop: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><VCIcon size={72} fontSize={26} rounded /></div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 600, color: '#2D1B33', marginBottom: 6 }}>{welcomeGreeting}</h2>
                  <p style={{ fontSize: 14, color: '#7A6B85', lineHeight: 1.6, maxWidth: 320, margin: '0 auto' }}>{welcomeText}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {starters.map((s, i) => (
                    <button key={i} onClick={() => send(s.text)} style={{ background: '#FFF', border: '1.5px solid rgba(107,79,122,0.1)', borderRadius: 16, padding: '14px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit', animation: `fadeIn 0.4s ease-out ${0.05 + i * 0.06}s both` }}>
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 13, color: '#2D1B33', lineHeight: 1.4 }}>{s.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
            {loading && <TypingDots />}
            <div ref={endRef} style={{ height: 12 }} />
          </div>
          <div style={{ padding: '10px 16px 18px' }}>
            <div style={{ display: 'flex', gap: 8, background: '#FFF', borderRadius: 22, padding: '5px 5px 5px 18px', border: '1.5px solid rgba(107,79,122,0.1)', boxShadow: '0 2px 16px rgba(107,79,122,0.05)' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)} placeholder="Tell me what's on your mind..." style={{ flex: 1, border: 'none', fontSize: 14.5, padding: '10px 0', background: 'transparent', color: '#2D1B33', fontFamily: 'inherit' }} />
              <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ width: 42, height: 42, borderRadius: 16, border: 'none', background: input.trim() && !loading ? 'linear-gradient(135deg, #6B4F7A, #8B6BAE)' : 'rgba(107,79,122,0.08)', color: input.trim() && !loading ? '#FFF' : '#9B8BA5', cursor: input.trim() && !loading ? 'pointer' : 'default', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>↑</button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 7, fontSize: 10.5, color: '#B5A8BF' }}>AI coach by Elina Allegroni · not a substitute for therapy</div>
          </div>
        </>}

        {tab === 'analyze' && (
          <div style={{ flex: 1, padding: 20, animation: 'fadeIn 0.4s ease-out' }}>
            <div style={{ textAlign: 'center', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#2D1B33', marginBottom: 6 }}>Situation Analyzer</h3>
              <p style={{ fontSize: 13.5, color: '#7A6B85', lineHeight: 1.5, maxWidth: 340, margin: '0 auto' }}>Paste a text exchange or describe what happened. I&apos;ll decode the signals using <em>The Allure Code</em> framework.</p>
            </div>
            <div style={{ background: '#FFF', borderRadius: 20, padding: 20, border: '1.5px solid rgba(107,79,122,0.08)' }}>
              <textarea id="analyzeInput" placeholder={gender === 'male' ? 'Paste her messages here, or describe the situation...\n\nExample: "She said she had a great time but hasn\'t replied to my follow-up text in 3 days."' : 'Paste his messages here, or describe the situation...\n\nExample: "He said he\'s not ready for a relationship but still texts me every day and gets jealous when I mention other guys."'} style={{ width: '100%', minHeight: 140, border: 'none', fontSize: 14, lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', color: '#2D1B33', background: 'transparent' }} />
              <button onClick={() => { const v = document.getElementById('analyzeInput')?.value; if (v?.trim()) { setTab('coach'); send('\ud83d\udd0d SITUATION ANALYSIS:\n\n' + v + '\n\nUsing The Allure Code frameworks, please analyze this situation. Identify red flags \ud83d\udd34, yellow flags \ud83d\udfe1, and green flags \ud83d\udfe2. Reference specific principles where relevant. Then give me your honest advice as Venus.'); } }} style={ctaStyle}>Decode This Situation ♀</button>
            </div>
          </div>
        )}

        {tab === 'energy' && (
          <div style={{ flex: 1, padding: 20, animation: 'fadeIn 0.4s ease-out' }}>
            {!eResult ? (<>
              <div style={{ textAlign: 'center', paddingTop: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#2D1B33', marginBottom: 4 }}>Your Energy Archetype</h3>
                <p style={{ fontSize: 13, color: '#9B8BA5' }}>Question {eStep + 1} of {ENERGY_QUIZ.length}</p>
              </div>
              <div style={{ height: 4, background: 'rgba(107,79,122,0.08)', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}><div style={{ height: '100%', background: 'linear-gradient(90deg, #6B4F7A, #8B6BAE)', width: `${(eStep / ENERGY_QUIZ.length) * 100}%`, transition: 'width 0.4s ease', borderRadius: 4 }} /></div>
              <div style={{ background: '#FFF', borderRadius: 20, padding: 22, border: '1.5px solid rgba(107,79,122,0.08)', boxShadow: '0 4px 20px rgba(107,79,122,0.04)' }}>
                <p style={{ fontSize: 15.5, fontWeight: 500, color: '#2D1B33', lineHeight: 1.5, marginBottom: 18, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif" }}>{ENERGY_QUIZ[eStep].q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{ENERGY_QUIZ[eStep].opts.map((o, i) => (<button key={i} onClick={() => handleEQuiz(o.arch)} style={quizOptStyle}>{o.text}</button>))}</div>
              </div>
            </>) : (
              <div style={{ animation: 'scaleIn 0.5s ease-out', paddingTop: 16 }}>
                {(() => { const a = ARCHETYPE_DATA[eResult]; return (<>
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ width: 90, height: 90, borderRadius: 30, margin: '0 auto 14px', background: a.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, boxShadow: `0 8px 32px ${a.color}33` }}>{a.emoji}</div>
                    <div style={{ fontSize: 12, color: '#9B8BA5', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Your Energy Archetype</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: a.color }}>{a.name}</h2>
                    <p style={{ fontSize: 14, color: '#7A6B85', fontStyle: 'italic', marginTop: 4 }}>{a.tagline}</p>
                  </div>
                  <div style={{ background: '#FFF', borderRadius: 20, padding: 22, border: `1.5px solid ${a.color}22`, marginBottom: 12 }}>
                    <p style={{ fontSize: 14, color: '#2D1B33', lineHeight: 1.65, marginBottom: 16 }}>{a.desc}</p>
                    {[['Your Strength', a.strength], ['Your Growth Edge', a.growth], ['Your Allure Code Insight', a.allureCode]].map(([label, text], i) => (
                      <div key={i} style={{ background: `${a.color}0A`, borderRadius: 14, padding: 16, marginBottom: i < 2 ? 12 : 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: a.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</div>
                        <p style={{ fontSize: 13.5, color: '#2D1B33', lineHeight: 1.5 }}>{text}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setTab('coach'); send(`My Energy Archetype is ${a.name}. ${a.tagline}. Based on The Allure Code, what specific advice would you give me to lean into my strengths and work on my growth edge?`); }} style={{ ...ctaStyle, flex: 1 }}>Get Personalized Coaching ♀</button>
                    <button onClick={() => { setEStep(0); setETally({}); setEResult(null); }} style={retakeStyle}>Retake</button>
                  </div>
                </>); })()}
              </div>
            )}
          </div>
        )}

        {tab === 'score' && (
          <div style={{ flex: 1, padding: 20, animation: 'fadeIn 0.4s ease-out' }}>
            {aResult === null ? (<>
              <div style={{ textAlign: 'center', paddingTop: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>✨</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#2D1B33', marginBottom: 4 }}>Your Allure Score</h3>
                <p style={{ fontSize: 13, color: '#9B8BA5' }}>Question {aStep + 1} of {ALLURE_QUIZ.length}</p>
              </div>
              <div style={{ height: 4, background: 'rgba(107,79,122,0.08)', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}><div style={{ height: '100%', background: 'linear-gradient(90deg, #6B4F7A, #8B6BAE)', width: `${(aStep / ALLURE_QUIZ.length) * 100}%`, transition: 'width 0.4s ease', borderRadius: 4 }} /></div>
              <div style={{ background: '#FFF', borderRadius: 20, padding: 22, border: '1.5px solid rgba(107,79,122,0.08)' }}>
                <p style={{ fontSize: 15.5, fontWeight: 500, color: '#2D1B33', lineHeight: 1.5, marginBottom: 18, textAlign: 'center', fontFamily: "'Cormorant Garamond', serif" }}>{ALLURE_QUIZ[aStep].q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{ALLURE_QUIZ[aStep].opts.map((o, i) => (<button key={i} onClick={() => handleAQuiz(o.score)} style={quizOptStyle}>{o.text}</button>))}</div>
              </div>
            </>) : (
              <div style={{ animation: 'scaleIn 0.5s ease-out', textAlign: 'center', paddingTop: 20 }}>
                {(() => { const r = getScoreResult(aResult); return (<>
                  <div style={{ width: 150, height: 150, borderRadius: '50%', margin: '0 auto 20px', background: `conic-gradient(${r.color} ${aResult}%, rgba(107,79,122,0.06) ${aResult}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 36px ${r.color}25` }}>
                    <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(170deg, #FDFAFF, #F6EFF9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 36, fontWeight: 700, color: '#2D1B33', fontFamily: "'Cormorant Garamond', serif" }}>{aResult}</div>
                      <div style={{ fontSize: 11, color: '#9B8BA5' }}>/ 100</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9B8BA5', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4 }}>Your Allure Level</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 600, color: r.color, marginBottom: 8 }}>{r.level}</h2>
                  <p style={{ fontSize: 14, color: '#7A6B85', lineHeight: 1.6, maxWidth: 340, margin: '0 auto 24px' }}>{r.desc}</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <button onClick={() => { setTab('coach'); send(`My Allure Score is ${aResult}/100 \u2014 level: "${r.level}". Using The Allure Code frameworks, give me a personalised action plan to raise my allure. What should I focus on first?`); }} style={{ ...ctaStyle, width: 'auto', padding: '14px 22px' }}>Get My Action Plan ♀</button>
                    <button onClick={() => { setAStep(0); setAScores([]); setAResult(null); }} style={retakeStyle}>Retake</button>
                  </div>
                </>); })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
