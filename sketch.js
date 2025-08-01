let slowMotion = false;
let mass1Slider, mass2Slider;
let m1 = 5, m2 = 7;
const g = 9.8;

const pulleyY = 100;
const pulleyRadius = 40;
const stringLength = 150;
const blockHeight = 40;

let yBase;
let pos = 0;
let v = 0;
let a = 0;

let dt = 0.05;
let isPaused = true;
let hasStarted = false;
let simulationEnded = false; // NEW flag

function setup() {
  createCanvas(800, 550);
  textFont('Segoe UI');
  setupSliders();
  setupControls();

  yBase = pulleyY + pulleyRadius * Math.SQRT1_2 + stringLength + blockHeight / 2;
  pos = 0;
  v = 0;

  window.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
      e.preventDefault(); // prevent scrolling
    }
  });

function positionExplanationButton() {
  const canvasElem = document.querySelector('canvas');
  const explanationBtn = document.getElementById('explanationBtn');
  if (!canvasElem || !explanationBtn) return;

  const canvasRect = canvasElem.getBoundingClientRect();

  // Position the button 10px from top and right inside canvas boundary
  explanationBtn.style.top = (canvasRect.top + window.scrollY + 10) + 'px';
  explanationBtn.style.left = (canvasRect.left + window.scrollX + canvasElem.width - explanationBtn.offsetWidth - 815) + 'px';
}

positionExplanationButton();

// Update position on resize and scroll
window.addEventListener('resize', positionExplanationButton);
window.addEventListener('scroll', positionExplanationButton);

// Toggle explanation panel
const explanationBtn = document.getElementById('explanationBtn');
const explanationPanel = document.getElementById('explanationPanel');
const closeExplanationBtn = document.getElementById('closeExplanationBtn');

explanationBtn.addEventListener('click', () => {
  if (explanationPanel.style.display === 'block') {
    explanationPanel.style.display = 'none';
  } else {
    explanationPanel.style.display = 'block';

    // Position panel below the button with small offset
    const btnRect = explanationBtn.getBoundingClientRect();
    explanationPanel.style.top = (btnRect.bottom + window.scrollY + 8) + 'px';
    explanationPanel.style.left = (btnRect.left + window.scrollX - explanationPanel.offsetWidth + explanationBtn.offsetWidth) + 'px';
  }
});

// Close button hides the panel
closeExplanationBtn.addEventListener('click', () => {
  explanationPanel.style.display = 'none';
});


}


function draw() {
  background(20);

  // Update motion only if not paused and simulation hasn't ended
  if (!isPaused && !simulationEnded) {
    let a_phys = ((m2 - m1) * g) / (m1 + m2);
    const pixelsPerMeter = 100;
    a = a_phys * pixelsPerMeter;

    v += a * dt;
    pos += v * dt;

    const maxPos = stringLength;
    if (pos > maxPos) {
      pos = maxPos;
      v = 0;
      simulationEnded = true;  // Mark simulation ended
    }
    if (pos < -maxPos) {
      pos = -maxPos;
      v = 0;
      simulationEnded = true;  // Mark simulation ended
    }
  }

  let y1 = yBase - pos;
  let y2 = yBase + pos;

  drawAtwoodSystem(y1, y2);

  // Recalculate values for display
  let a_phys = ((m2 - m1) * g) / (m1 + m2);
  const pixelsPerMeter = 100;
  let v1_mps = -v / pixelsPerMeter;
  let v2_mps = v / pixelsPerMeter;
  let T1 = m1 * (g + a_phys);
  let a1 = -a_phys;
  let a2 = a_phys;

  // Display stats
  fill(255);
  textSize(15);
  textStyle(NORMAL);
  textAlign(LEFT);
  const x = 20, y = 30, spacing = 25;

  text(`Mass 1: ${m1.toFixed(1)} kg`, x, y);
  text(`Mass 2: ${m2.toFixed(1)} kg`, x, y + spacing);
  text(`Velocity 1: ${v1_mps.toFixed(2)} m/s`, x, y + spacing * 2);
  text(`Velocity 2: ${v2_mps.toFixed(2)} m/s`, x, y + spacing * 3);
  text(`Acceleration 1: ${a1.toFixed(2)} m/s²`, x, y + spacing * 4);
  text(`Acceleration 2: ${a2.toFixed(2)} m/s²`, x, y + spacing * 5);
  text(`Displacement: ${(pos / pixelsPerMeter).toFixed(2)} m`, x, y + spacing * 6);
  text(`Tension: ${T1.toFixed(2)} N`, x, y + spacing * 7);

  // --- Draw pause/start message LAST so it's always on top ---
  if (isPaused) {
    fill(255, 80, 80);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    const message = hasStarted ? "PAUSED – Press SPACE to resume" : "Press SPACE to start simulation";
    text(message, width / 2, height / 2);
  }
}

function setupSliders() {
  mass1Slider = select('#mass1Slider');
  mass2Slider = select('#mass2Slider');

  mass1Slider.input(() => {
    m1 = parseFloat(mass1Slider.value());
    select('#mass1Label').html(m1.toFixed(1));
    resetMotion();
  });

  mass2Slider.input(() => {
    m2 = parseFloat(mass2Slider.value());
    select('#mass2Label').html(m2.toFixed(1));
    resetMotion();
  });
}

function setupControls() {
  select('#pauseBtn').mousePressed(() => isPaused = true);
  select('#resumeBtn').mousePressed(() => isPaused = false);
  select('#resetBtn').mousePressed(() => {
    resetMotion();
    isPaused = true;
    hasStarted = false;
    simulationEnded = false;
  });

  select('#slowMotionBtn').mousePressed(() => {
    slowMotion = !slowMotion;
    dt = slowMotion ? 0.015 : 0.05;  // slower time step in slow motion
    select('#slowMotionStatus').html(slowMotion ? 'Slow Motion: ON' : 'Normal Speed');
  });
}


function resetMotion() {
  pos = 0;
  v = 0;
  simulationEnded = false;  // reset flag here as well
}

function drawAtwoodSystem(y1, y2) {
  const pulleyX = width / 2;
  const blockWidth = 40;

  const leftAngle = radians(135);
  const rightAngle = radians(45);

  const leftX = pulleyX + pulleyRadius * cos(leftAngle);
  const leftY = pulleyY + pulleyRadius * sin(leftAngle);

  const rightX = pulleyX + pulleyRadius * cos(rightAngle);
  const rightY = pulleyY + pulleyRadius * sin(rightAngle);

  // --- Pulley ---
  noStroke();
  fill(80);
  circle(pulleyX, pulleyY, pulleyRadius * 2);
  fill(180);
  circle(pulleyX, pulleyY, 10);

  // --- Strings ---
  noFill();
  stroke(255);
  strokeWeight(2);
  arc(pulleyX, pulleyY, pulleyRadius * 2, pulleyRadius * 2, leftAngle, rightAngle);
  line(leftX, leftY, leftX, y1 - blockHeight / 2);
  line(rightX, rightY, rightX, y2 - blockHeight / 2);

  // --- Blocks ---
  rectMode(CENTER);
  fill(100, 200, 255);
  rect(leftX, y1, blockWidth, blockHeight);

  fill(255, 100, 100);
  rect(rightX, y2, blockWidth, blockHeight);
}

function keyPressed() {
  if (key === ' ' || key === 'Spacebar') {
    if (simulationEnded) {
      // If simulation ended and space pressed, reset and pause
      resetMotion();
      isPaused = true;
      hasStarted = false;
      simulationEnded = false;
    } else {
      // Normal pause/unpause toggle
      isPaused = !isPaused;
      hasStarted = true;
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  if (key.toLowerCase() === 's') {
    slowMotion = !slowMotion;
    dt = slowMotion ? 0.015 : 0.05;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
