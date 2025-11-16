console.log("chat mate...");

const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chatContainer");
const askBtn = document.querySelector("#ask");
const scrollBtn = document.querySelector("#scrollBtn");

const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

input.addEventListener('keyup', handleEnter);
askBtn.addEventListener('click', handleAsk);

// --------------------
// ⭐ LOADING STATE
// --------------------
const loading = document.createElement('div');
loading.className = 'my-6 animate-pulse';
loading.textContent = 'Thinking...';

// -----------------
// ⭐ SCROLL ARROW
// -----------------
chatContainer.addEventListener("scroll", () => {
    const isAtBottom =
        chatContainer.scrollTop + chatContainer.clientHeight >=
        chatContainer.scrollHeight - 20;

    if (isAtBottom) {
        scrollBtn.classList.add("hidden");
    } else {
        scrollBtn.classList.remove("hidden");
    }
});

scrollBtn.addEventListener("click", () => {
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
});

function autoScroll() {
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
}

// ---------------
// ⭐ MAIN LOGIC 
// ---------------
async function generate(text) {

  const msg = document.createElement("div");
  msg.className = `my-6 bg-neutral-700 px-3 py-2 max-w-fit ml-auto rounded-xl`;
  msg.textContent = text;
  chatContainer.appendChild(msg);
  input.value = "";
  autoScroll();

  chatContainer.appendChild(loading);

  autoScroll();

  const assistantMessage = await callServer(text);

  const assisMsgEle = document.createElement("div");
  assisMsgEle.className = `my-6 bg-neutral-900 px-3 py-2 max-w-fit rounded-xl`;
  assisMsgEle.textContent = assistantMessage;
  chatContainer.appendChild(assisMsgEle);

  loading.remove();
  autoScroll();

  console.log("assistant: ",assistantMessage);
}

// -------------------
// ⭐ CALLING SERVER
// -------------------
async function callServer(inputText) {
    const response = await fetch(`http://localhost:3000/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({threadId: threadId, message: inputText}),
    });
    if(!response.ok){
        throw new Error('Error generating the response');
    }

    const result = await response.json();
    return result.message;
    
}

async function handleAsk(e){
    const text = input.value;
    if(!text) return;
    await generate(text);
}

async function handleEnter(e) {
  if (e.key == "Enter") {
    const text = input.value;
    console.log(text);

    if (!text) return;
    await generate(text);
  }
}

