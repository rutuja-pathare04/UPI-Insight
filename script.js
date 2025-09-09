//  let balance = 10000;
//         const correctPIN = "4805";

//         // Page Navigation
//         function nextPage(pageId) {
//             gsap.to(".container:not(.hidden)", {
//                 opacity: 0, y: 20, duration: 0.3, onComplete: function () {
//                     document.querySelector(".container:not(.hidden)").classList.add('hidden');
//                     document.getElementById(pageId).classList.remove('hidden');
//                     gsap.from("#" + pageId, { opacity: 0, y: 20, duration: 0.5 });
//                 }
//             });
//         }

//         // Show backend diagram after entering amount
//         function showBackendFlow(nextPageId) {
//             const amount = parseInt(document.getElementById("amount").value);
//             if (isNaN(amount) || amount <= 0) { alert("Enter valid amount"); return; }
//             if (amount > balance) { alert("Insufficient balance! Available: ₹" + balance); return; }
//             nextPage('backendDiagram');

//             // Animate steps + arrows
//             const steps = ["step1", "step2", "step3", "step4", "step5"];
//             const arrows = ["arrow1", "arrow2", "arrow3", "arrow4"];
//             let delay = 0;
//             steps.forEach((id, i) => {
//                 setTimeout(() => {
//                     document.getElementById(id).classList.add('highlight');
//                     if (i < arrows.length) {
//                         document.getElementById(arrows[i]).classList.add('active');
//                     }
//                 }, delay);
//                 delay +=5000;
//             });

//             // After animation, go to PIN page
//             setTimeout(() => {
//                 nextPage(nextPageId);
//                 steps.forEach(id => document.getElementById(id).classList.remove('highlight'));
//                 arrows.forEach(id => document.getElementById(id).classList.remove('active'));
//             }, delay + 2000);
//         }

//         // Process Transaction
//         function processTransaction() {
//             const amount = parseInt(document.getElementById("amount").value);
//             const pin = document.getElementById("pin").value;
//             if (pin !== correctPIN) { alert("Incorrect PIN! Try again."); return; }

//             nextPage('processingPage');

//             setTimeout(() => {
//                 balance -= amount;
//                 document.getElementById('processingPage').classList.add('hidden');
//                 document.getElementById('successPage').classList.remove('hidden');

//                 const txnId = 'TXN' + Math.floor(Math.random() * 1000000);
//                 const date = new Date().toLocaleString();

//                 const receipt = document.getElementById('receipt');
//                 receipt.innerHTML = `
//       Transaction ID: ${txnId} <br>
//       Amount: ₹${amount} <br>
//       Paid to: Rutuja Pathare <br>
//       UPI ID: rutujapathare48@sbi <br>
//       Date: ${date} <br>
//       Available Balance: ₹${balance}
//     `;

//                 // Update balance display
//                 document.getElementById("balanceText").innerHTML = "<b>Available Balance:</b> ₹" + balance;

//                 // SMS Popup
//                 const smsPopup = document.getElementById('smsPopup');
//                 smsPopup.innerHTML = `₹${amount} paid to Rutuja Pathare. Ref: ${txnId}`;
//                 smsPopup.style.display = 'block';
//                 gsap.fromTo(smsPopup, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
//                 setTimeout(() => {
//                     gsap.to(smsPopup, { y: -40, opacity: 0, duration: 0.5, onComplete: () => { smsPopup.style.display = 'none'; } });
//                 }, 6000);

//                 // Success sound
//                 document.getElementById('successSound').play();

//             }, 2000);
//         }

// function showPage(pageId) {
//     const pages = document.querySelectorAll(".container");
//     pages.forEach(page => page.classList.add("hidden"));
//     document.getElementById(pageId).classList.remove("hidden");
// }

// function nextPage() {
//     showPage("amountPage");
// }

// function proceedToPin() {
//     const amount = document.getElementById("amount").value;
//     const balance = 5000; // Example balance
//     const amountError = document.getElementById("amountError");

//     amountError.textContent = "";

//     if (!amount || amount <= 0) {
//         amountError.textContent = "⚠️ Please enter a valid amount.";
//         return;
//     }

//     if (amount > balance) {
//         amountError.textContent = "⚠️ Insufficient balance.";
//         return;
//     }

//     showPage("pinPage");
// }

// function validatePIN() {
//     const enteredPIN = document.getElementById("pin").value;
//     const pinError = document.getElementById("pinError");
//     const amount = parseFloat(document.getElementById("amount").value);
//     let balance = 5000; // Example balance

//     pinError.textContent = "";

//     if (enteredPIN !== "1234") {
//         pinError.textContent = "❌ Incorrect UPI PIN. Please try again.";
//         return;
//     }

//     if (amount > balance) {
//         pinError.textContent = "⚠️ Insufficient balance.";
//         return;
//     }

//     // Success → move to processing then success page
//     showPage("processing");
//     setTimeout(() => {
//         showPage("success");
//     }, 2000);
// }

// function showBackendFlow() {
//     showPage("backend");
// }

    // script.js — full updated code
// Drop this file into the same folder and make sure your HTML has:
// - amount input with id="amount"
// - pin input with id="pin"
// - <div id="amountError"></div> under amount input
// - <div id="pinError"></div> under pin input
// - containers with ids: bankDetails, amountPage, pinPage, processingPage, successPage, backendDiagram
// - optional elements: step1..step5 and arrow1..arrow4 for backend animation
// - element id="receipt", id="balanceText", id="smsPopup", and audio id="successSound"

window.addEventListener('DOMContentLoaded', () => {
  let balance = 10000;                 // initial balance
  const correctPIN = "4805";           // correct PIN

  // helper: animate switch between containers (uses GSAP if available)
  function animateSwitch(fromEl, toEl, cb) {
    if (!fromEl) {
      // no currently visible container -> just show target
      toEl.classList.remove('hidden');
      if (window.gsap) gsap.from(toEl, { opacity: 0, y: 20, duration: 0.35, onComplete: cb });
      else if (cb) cb();
      return;
    }

    if (window.gsap) {
      gsap.to(fromEl, {
        opacity: 0, y: 20, duration: 0.28, onComplete() {
          fromEl.classList.add('hidden');
          toEl.classList.remove('hidden');
          gsap.from(toEl, { opacity: 0, y: 18, duration: 0.35, onComplete: cb });
        }
      });
    } else {
      fromEl.classList.add('hidden');
      toEl.classList.remove('hidden');
      if (cb) cb();
    }
  }

  // universal page switch (used by onclick in HTML)
  function nextPage(pageId) {
    const next = document.getElementById(pageId);
    if (!next) return;
    const current = document.querySelector('.container:not(.hidden)');
    // if next already visible, do nothing
    if (current === next) return;
    animateSwitch(current, next);
  }

  // Validate amount and show backend diagram animation (then go to PIN page)
  function showBackendFlow(nextPageId) {
    const amountEl = document.getElementById('amount');
    const amountError = document.getElementById('amountError');
    const amount = amountEl ? parseInt(amountEl.value, 10) : NaN;

    // safety: ensure amountError exists (if not, create it to avoid silent failure)
    if (!amountError && document.getElementById('amountPage')) {
      const div = document.createElement('div');
      div.id = 'amountError';
      div.className = 'error-msg';
      document.getElementById('amountPage').insertBefore(div, document.querySelector('#amountPage button'));
    }

    // Re-get after potential creation
    const amtErr = document.getElementById('amountError');

    // validations (show messages inside card)
    if (isNaN(amount) || amount <= 0) {
      if (amtErr) {
        amtErr.textContent = '⚠️ Please enter a valid amount.';
        if (window.gsap) gsap.fromTo(amtErr, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      return;
    }

    if (amount > balance) {
      if (amtErr) {
        amtErr.textContent = `⚠️ Insufficient balance! Available: ₹${balance}`;
        if (window.gsap) gsap.fromTo(amtErr, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      return;
    }

    // clear any previous amount error
    if (amtErr) amtErr.textContent = '';

    // show backendDiagram and animate steps/arrows sequentially
    nextPage('backendDiagram');

    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    const arrows = ['arrow1', 'arrow2', 'arrow3', 'arrow4'];
    let baseDelay = 2000; // start after 4000ms
    const stepInterval = 2500;

    steps.forEach((id, idx) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('highlight');
          // small pop animation if GSAP present
          if (window.gsap) gsap.fromTo(el, { scale: 0.98, opacity: 0.45 }, { scale: 1, opacity: 1, duration: 0.35 });
        }
        const arrow = document.getElementById(arrows[idx]);
        if (arrow) arrow.classList.add('active');
      }, baseDelay + idx * stepInterval);
    });

    // after animation finishes, go to the requested next page (PIN page)
    const totalDelay = baseDelay + steps.length * stepInterval + 500;
    setTimeout(() => {
      // clear highlights & arrows
      steps.forEach(id => { const e = document.getElementById(id); if (e) e.classList.remove('highlight'); });
      arrows.forEach(id => { const a = document.getElementById(id); if (a) a.classList.remove('active'); });

      nextPage(nextPageId);
    }, totalDelay);
  }

  // Process transaction: validate PIN, show processing and success, update receipt & balance
  function processTransaction() {
    const amountEl = document.getElementById('amount');
    const pinEl = document.getElementById('pin');
    const pinError = document.getElementById('pinError');

    const amount = amountEl ? parseInt(amountEl.value, 10) : NaN;
    const pin = pinEl ? pinEl.value : '';

    // ensure pinError exists
    if (!pinError && document.getElementById('pinPage')) {
      const div = document.createElement('div');
      div.id = 'pinError';
      div.className = 'error-msg';
      const pinPage = document.getElementById('pinPage');
      // Insert after the pin input (attempt)
      const pinInput = pinPage.querySelector('input[type="password"], #pin');
      if (pinInput && pinInput.parentNode) pinInput.parentNode.insertBefore(div, pinInput.nextSibling);
      else pinPage.insertBefore(div, pinPage.querySelector('button'));
    }

    const pErr = document.getElementById('pinError');

    // PIN check
    if (pin !== correctPIN) {
      if (pErr) {
        pErr.textContent = '❌ Incorrect PIN. Please try again.';
        if (window.gsap) gsap.fromTo(pErr, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      return;
    }

    // amount check (again)
    if (isNaN(amount) || amount <= 0) {
      if (pErr) {
        pErr.textContent = '⚠️ Invalid amount.';
        if (window.gsap) gsap.fromTo(pErr, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      return;
    }
    if (amount > balance) {
      if (pErr) {
        pErr.textContent = `⚠️ Insufficient balance! Available: ₹${balance}`;
        if (window.gsap) gsap.fromTo(pErr, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      }
      return;
    }

    // clear pin error
    if (pErr) pErr.textContent = '';

    // Move to processing UI
    nextPage('processingPage');

    // simulate processing delay then success
    setTimeout(() => {
      // deduct balance
      balance = Math.max(0, balance - amount);

      // Prepare receipt details
      const txnId = 'TXN' + Math.floor(Math.random() * 1000000000);
      const dateStr = new Date().toLocaleString('en-IN');

      const receiptEl = document.getElementById('receipt');
      if (receiptEl) {
        receiptEl.innerHTML = `
          <p><b>Transaction ID:</b> ${txnId}</p>
          <p><b>Amount:</b> ₹${amount}</p>
          <p><b>Paid to:</b> Rutuja Pathare</p>
          <p><b>UPI ID:</b> rutujapathare48@sbi</p>
          <p><b>Date:</b> ${dateStr}</p>
          <p><b>Available Balance:</b> ₹${balance}</p>
        `;
      }

      // Update balance text on earlier card (if present)
      const balanceText = document.getElementById('balanceText');
      if (balanceText) balanceText.innerHTML = `<b>Available Balance:</b> ₹${balance}`;

      // Show success page
      nextPage('successPage');

      // Show SMS popup
      const smsPopup = document.getElementById('smsPopup');
      if (smsPopup) {
        smsPopup.innerHTML = `₹${amount} paid to Rutuja Pathare. Ref: ${txnId}`;
        smsPopup.style.display = 'block';
        if (window.gsap) {
          gsap.fromTo(smsPopup, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
          // hide after 5s
          setTimeout(() => {
            gsap.to(smsPopup, { y: -30, opacity: 0, duration: 0.45, onComplete: () => { smsPopup.style.display = 'none'; } });
          }, 4800);
        } else {
          setTimeout(() => { smsPopup.style.display = 'none'; }, 4800);
        }
      }

      // play success sound (safe catch)
      const sound = document.getElementById('successSound');
      if (sound) sound.play && sound.play().catch(() => { /* autoplay may be blocked */ });

    }, 2000);
  }

  // Clear inline errors when user types again
  const amountInput = document.getElementById('amount');
  if (amountInput) {
    amountInput.addEventListener('input', () => {
      const e = document.getElementById('amountError');
      if (e) e.textContent = '';
    });
  }

  const pinInput = document.getElementById('pin');
  if (pinInput) {
    pinInput.addEventListener('input', () => {
      const e = document.getElementById('pinError');
      if (e) e.textContent = '';
    });
  }

  // Expose functions to global scope so onclick attributes can call them
  window.nextPage = nextPage;
  window.showBackendFlow = showBackendFlow;
  window.processTransaction = processTransaction;
});
