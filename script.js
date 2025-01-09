let normalQueue = Array.from({ length: 160 }, (_, i) => i + 1);
let priorityQueue = Array.from({ length: 160 }, (_, i) => i + 1);

let lastCalledNormal = null;
let lastCalledPriority = null;
let lastCalledMesa = null;

let adminWindow = null;
let userWindow = null;

// Função para tocar som
function playSound() {
  const sound = new Audio('teste.mp3');
  sound.play();
}

// Função para chamar uma senha normal
function callNormal(mesa) {
  if (normalQueue.length === 0) return alert("Todas as senhas normais já foram chamadas.");
  const senha = normalQueue.shift();
  lastCalledNormal = senha;
  lastCalledMesa = mesa;
  updateHistory(mesa, "Senha", senha);
  if (adminWindow) adminWindow.updateAdminDisplay(mesa, "Senha", senha);
  if (userWindow) userWindow.updateUserDisplay(senha, "Senha", mesa);
  playSound();
}

// Função para chamar uma senha prioritária
function callPriority(mesa) {
  if (priorityQueue.length === 0) return alert("Todas as senhas prioritárias já foram chamadas.");
  const senha = priorityQueue.shift();
  lastCalledPriority = senha;
  lastCalledMesa = mesa;
  updateHistory(mesa, "Prioritária", senha);
  if (adminWindow) adminWindow.updateAdminDisplay(mesa, "Prioritária", senha);
  if (userWindow) userWindow.updateUserDisplay(senha, "Prioritária", mesa);
  playSound();
}

// Função para atualizar o histórico de senhas
function updateHistory(mesa, tipo, senha) {
  const history = JSON.parse(localStorage.getItem(mesa)) || [];
  history.push({ tipo, senha });
  if (history.length > 5) history.shift(); 
  localStorage.setItem(mesa, JSON.stringify(history));
}

// Função para tocar o som novamente (sem alterar a fila de senhas)
function playLastSound() {
  if (!lastCalledMesa) return alert("Nenhuma senha foi chamada ainda.");
  playSound();
}

// Função para abrir a janela administrativa
document.getElementById("openAdminWindow").addEventListener("click", () => {
  if (adminWindow && !adminWindow.closed) {
    adminWindow.focus();
  } else {
    adminWindow = window.open("", "Admin", "width=500,height=600");
    adminWindow.document.write(`
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Painel Administrativo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; text-align: center; background-color: #f7f7f7; }
          h1 { color: #007BFF; }
          .admin-buttons { display: flex; flex-direction: column; gap: 15px; }
          .admin-buttons button { background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 1.2em; }
          .admin-buttons button:hover { background-color: #0056b3; }
          .admin-buttons button:active { background-color: #003f7f; }
        </style>
      </head>
      <body>
        <h1>Painel Administrativo</h1>
        <div class="admin-buttons">
          <button onclick="window.opener.callNormal('Mesa 1')">Chamar Senha  Mesa 1</button>
          <button onclick="window.opener.callPriority('Mesa 1')">Chamar Senha Prioritária Mesa 1</button>
          <button onclick="window.opener.callNormal('Mesa 2')">Chamar Senha  Mesa 2</button>
          <button onclick="window.opener.callPriority('Mesa 2')">Chamar Senha Prioritária Mesa 2</button>
          <button onclick="window.opener.callNormal('Mesa 3')">Chamar Senha  Mesa 3</button>
          <button onclick="window.opener.callPriority('Mesa 3')">Chamar Senha Prioritária Mesa 3</button>
	  <button onclick="window.opener.callNormal('Mesa 4')">Chamar Senha  Mesa 4</button>
          <button onclick="window.opener.callPriority('Mesa 4')">Chamar Senha Prioritária Mesa 4</button>
          <button onclick="window.opener.playLastSound()">Chamar Senha Novamente</button>
        </div>
        <h2>Histórico de Senhas</h2>
        <div id="history"></div>
        <script>
          function updateAdminDisplay(mesa, tipo, senha) {
            const historyDiv = document.getElementById("history");
            historyDiv.innerHTML = "";
            const history = JSON.parse(localStorage.getItem(mesa)) || [];
            history.reverse().forEach(item => {
              const div = document.createElement("div");
              div.textContent = \`\${item.tipo} \${item.senha}\`;
              historyDiv.appendChild(div);
            });
          }
          window.updateAdminDisplay = updateAdminDisplay;
        </script>
      </body>
      </html>
    `);
  }
});

// Função para abrir a janela do usuário
document.getElementById("openUserWindow").addEventListener("click", () => {
  if (userWindow && !userWindow.closed) {
    userWindow.focus();
  } else {
    userWindow = window.open("", "User", "width=500,height=600");
    userWindow.document.write(`
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Senhas Chamadas</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; text-align: center; background-color: #f7f7f7; }
          h1 { color: #007BFF; }
          #currentSenha { font-size: 1.5em; margin: 20px; }
          #userHistoryTitle { font-size: 1.3em; font-weight: bold; margin-top: 30px; color: #555; }
          #userHistory { margin-top: 10px; font-size: 1.1em; }
        </style>
      </head>
      <body>
	<!-- Adicione sua imagem aqui -->
  	<img src="etec.png" alt="Logotipo Vestibulinho">

	<h1>Vestibulinho - 2025</h1>
	
        <h1>Senhas Chamadas</h1>
        <div id="currentSenha">Esperando pela próxima senha...</div>
        <div id="userHistoryTitle">Histórico de Senhas</div>
        <div id="userHistory"></div>
        <script>
          function updateUserDisplay(senha, tipo, mesa) {
            document.getElementById("currentSenha").textContent = \`Senha chamada: \${tipo} \${senha} para \${mesa}\`;
            const userHistoryDiv = document.getElementById("userHistory");
            const historyItem = document.createElement("div");
            historyItem.classList.add("history-item");
            historyItem.textContent = \`\${tipo} \${senha}\`;
            userHistoryDiv.insertBefore(historyItem, userHistoryDiv.firstChild);
            if (userHistoryDiv.children.length > 5) {
              userHistoryDiv.removeChild(userHistoryDiv.lastElementChild);
            }
          }
          window.updateUserDisplay = updateUserDisplay;
        </script>
      </body>
      </html>
    `);
  }
});
