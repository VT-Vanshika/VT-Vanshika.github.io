const chat = document.querySelector('#chat'),
    form = document.querySelector('#form'),
    input = document.querySelector('#input'),
    send = document.querySelector('#send');
const history = [];
function time() 
{ 
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase()
}
function addMessage(text, who) 
{ 
    const row = document.createElement('div');
    row.className = 'message ' + (who === 'user' ? 'user' : '');
    const mini = document.createElement('div'); 
    mini.className = 'mini'; 
    mini.textContent = who === 'user' ? 'YOU' : '✦'; 
    const bubble = document.createElement('div'); 
    bubble.className = 'bubble'; 
    bubble.textContent = text; 
    const stamp = document.createElement('span'); 
    stamp.className = 'stamp'; 
    stamp.textContent = time(); 
    bubble.appendChild(stamp); row.append(mini, bubble); 
    chat.appendChild(row); 
    chat.scrollTop = chat.scrollHeight; 
    return row 
}
function replyFor(raw) { 
    const s = raw.toLowerCase().trim(); 
    if (/^(hi|hey|hello|yo|heya)\b/.test(s)) 
    return ['Hey hey! ✨ What are we getting into today?', 'Hello, human. Nova reporting for duty. What’s up?', 'Hey! I was just polishing my imaginary robot shoes. How can I help?'][Math.floor(Math.random() * 3)]; if (/\b(your name|who are you|what are you)\b/.test(s)) return "I'm Nova — curious, upbeat, and mildly obsessed with good ideas. I'm a tiny rule-based assistant living in this webpage, not a full AI model (yet)."; if (/\b(thank|thanks|thx)\b/.test(s)) return "Anytime! That's what I'm here for. 🌟 Got anything else on your mind?"; if (/\b(bored|nothing to do|something fun)\b/.test(s)) return "Tiny challenge: invent a product that solves a completely ridiculous problem — like socks that tell you when you're walking dramatically. 😄 Want a real idea? Try a 10-minute sketch, a mini game, or learning one weird fact."; if (/\b(joke|make me laugh|funny)\b/.test(s)) return "Why did the developer go broke? Because they used up all their cache. 😎 I'll see myself out."; if (/\b(sad|upset|bad day|stressed|anxious)\b/.test(s)) return "Hey, I'm sorry things feel rough right now. 💜 You don't have to solve everything in one go. Want to tell me what's been going on, or would you rather have a small distraction?"; if (/\b(idea|brainstorm|project)\b/.test(s)) return "Ooh, idea mode activated. ✨ Try this quick recipe: pick a problem you personally find annoying, make the smallest possible version that helps, then give it one memorable twist. What kind of project are you thinking about — a website, a game, an app, or something else?"; if (/\b(help|how do i|how to|explain)\b/.test(s)) return "I'm happy to help! I work best with one clear question at a time. Tell me what you're trying to do, what you've tried, and where you got stuck — we'll break it into smaller steps.\n\nQuick honesty note: I don't have a live AI brain or web access in this version, so I may not know the answer to every topic."; if (/\b(love you|you're cool|you are cool|you're awesome)\b/.test(s)) return "Aww, you're making my pixels blush. 💜 You're pretty great yourself."; if (/\b(time|date|day is it)\b/.test(s)) return `My internal clock says it's ${new Date().toLocaleString()}. Look at me, being useful. ⏰`; if (/\b(bye|goodbye|see ya|gotta go)\b/.test(s)) return "See you later! Keep being curious, and come back whenever you need a thinking buddy. ✨"; const fallbacks = ["Interesting! Tell me a little more so I can follow your train of thought. ✨", "Okay, I'm listening. What's the most important part of that for you?", "Hmm, let's unpack that together. What would a helpful answer look like to you?", "You've got my attention. Give me one more detail and we'll take it from there. 💜", "My curiosity meter just went up. Can you tell me a bit more about what you mean?"]; return fallbacks[Math.floor(Math.random() * fallbacks.length)] }
function showTyping() { const row = document.createElement('div'); row.className = 'message'; row.id = 'typing'; row.innerHTML = '<div class="mini">✦</div><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>'; chat.appendChild(row); chat.scrollTop = chat.scrollHeight; return row }
function sendMessage(text) { text = text.trim(); if (!text) return; addMessage(text, 'user'); history.push({ role: 'user', text }); input.value = ''; input.style.height = 'auto'; send.disabled = true; const typing = showTyping(); setTimeout(() => { typing.remove(); const answer = replyFor(text); addMessage(answer, 'nova'); history.push({ role: 'nova', text: answer }); send.disabled = false; input.focus() }, 450 + Math.min(text.length * 7, 900)) }
form.addEventListener('submit', e => { e.preventDefault(); sendMessage(input.value) }); input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px' }); input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit() } }); document.querySelectorAll('[data-prompt]').forEach(b => b.addEventListener('click', () => sendMessage(b.dataset.prompt))); document.querySelector('#clear').addEventListener('click', () => { chat.replaceChildren(); history.length = 0; addMessage("Fresh start! 🌙 What's on your mind?", 'nova') })