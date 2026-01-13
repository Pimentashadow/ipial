
  // ===== VARIÁVEIS GLOBAIS =====
  let candidatos = [];

  // ===== ELEMENTOS DOM =====
  const loginPage = document.getElementById('loginPage');
  const adminPanel = document.getElementById('adminPanel');
  const studentPanel = document.getElementById('studentPanel');
  const loginForm = document.getElementById('loginForm');
  const userInput = document.getElementById('user');
  const passInput = document.getElementById('pass');

  // Botões Admin
  const btnDashboard = document.getElementById('btnDashboard');
  const btnCandidatos = document.getElementById('btnCandidatos');
  const btnRelatorios = document.getElementById('btnRelatorios');
  const btnLogoutAdmin = document.getElementById('btnLogoutAdmin');

  // Botões de formulário admin
  const btnAddCandidato = document.getElementById('btnAddCandidato');
  const btnAplicarFiltro = document.getElementById('btnAplicarFiltro');
  const btnExportarPDF = document.getElementById('btnExportarPDF');

  // Botões aluno
  const btnSearchStudent = document.getElementById('btnSearchStudent');
  const btnLogoutStudent = document.getElementById('btnLogoutStudent');
  const studentCode = document.getElementById('studentCode');

  // Campos de entrada
  const nomeEl = document.getElementById('nome');
  const idadeEl = document.getElementById('idade');
  const biEl = document.getElementById('bi');
  const contactoEl = document.getElementById('contacto');
  const cursoEl = document.getElementById('curso');
  const estadoEl = document.getElementById('estado');

  // Elementos de dashboard
  const totalEl = document.getElementById('total');
  const aprovadosEl = document.getElementById('aprovados');
  const reprovadosEl = document.getElementById('reprovados');
  const pendentesEl = document.getElementById('pendentes');
  const resumoCursosEl = document.getElementById('resumoCursos');

  // Tabelas e filtros
  const listaEl = document.getElementById('lista');
  const filtroCursoEl = document.getElementById('filtroCurso');
  const filtroEstadoEl = document.getElementById('filtroEstado');
  const tabelaRelatorioEl = document.getElementById('tabelaRelatorio');

  // Credenciais por senha
  const adminPassword = '1234';
  const studentPassword = '5678';

  // ===== EVENT LISTENERS =====
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
  });

  btnDashboard.addEventListener('click', function() {
    showPage('dashboard', this);
  });

  btnCandidatos.addEventListener('click', function() {
    showPage('candidatos', this);
  });

  btnRelatorios.addEventListener('click', function() {
    showPage('relatorios', this);
  });

  btnLogoutAdmin.addEventListener('click', logout);
  btnLogoutStudent.addEventListener('click', logout);

  btnAddCandidato.addEventListener('click', addCandidato);
  btnAplicarFiltro.addEventListener('click', aplicarFiltro);
  btnExportarPDF.addEventListener('click', gerarPDF);
  btnSearchStudent.addEventListener('click', searchStudentResult);

  // Enter na busca do aluno
  studentCode.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchStudentResult();
  });

  // ===== FUNÇÕES =====

  function handleLogin() {
    const user = userInput.value.trim();
    const pass = passInput.value.trim();

    if (!user || !pass) {
      alert('Preencha todos os campos');
      return;
    }

    // Verifica a senha para determinar o acesso
    if (pass === adminPassword) {
      // Acesso ao painel admin
      loginPage.classList.add('hidden');
      adminPanel.classList.remove('hidden');
      atualizarDashboard();
    } else if (pass === studentPassword) {
      // Acesso à página de resultados do aluno
      loginPage.classList.add('hidden');
      studentPanel.classList.remove('hidden');
    } else {
      alert('Utilizador ou palavra-passe inválidos');
    }

    userInput.value = '';
    passInput.value = '';
  }

  function logout() {
    location.reload();
  }

  function showPage(pageId, button) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('candidatos').classList.add('hidden');
    document.getElementById('relatorios').classList.add('hidden');
    
    document.getElementById(pageId).classList.remove('hidden');

    document.querySelectorAll('.sidebar nav button:not(.logout)').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  }

  function addCandidato() {
    const nome = nomeEl.value.trim();
    const idade = idadeEl.value.trim();
    const bi = biEl.value.trim();
    const contacto = contactoEl.value.trim();
    const curso = cursoEl.value.trim();
    const estado = estadoEl.value;

    if (!nome || !idade || !bi || !contacto || !curso) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (candidatos.find(c => c.bi === bi)) {
      alert('Já existe um candidato com este BI');
      return;
    }

    const codigo = Math.random().toString(36).substr(2, 9).toUpperCase();
    const media = Math.random() * 20;

    candidatos.push({
      nome,
      idade: Number(idade),
      bi,
      contacto,
      curso,
      estado,
      media,
      codigo
    });

    atualizarCursos();
    listar();
    atualizarDashboard();
    
    nomeEl.value = '';
    idadeEl.value = '';
    biEl.value = '';
    contactoEl.value = '';
    cursoEl.value = '';
    estadoEl.value = 'Pendente';

    alert('Candidato registado com sucesso! Código: ' + codigo);
  }

  function listar() {
    listaEl.innerHTML = '';
    candidatos.forEach((c, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${c.nome}</td>
        <td>${c.curso}</td>
        <td>${c.codigo}</td>
        <td>${c.estado}</td>
        <td>
          <button type="button" class="action-btn" onclick="editCandidato(${i})">Editar</button>
          <button type="button" class="action-btn delete" onclick="deleteCandidato(${i})">Apagar</button>
          <button type="button" class="action-btn" onclick="copyCode('${c.codigo}')">Copiar código</button>
        </td>
      `;
      listaEl.appendChild(row);
    });
  }

  function copyCode(code) {
    if (!code) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function() {
        alert('Código copiado: ' + code);
      }, function() {
        prompt('Copiar código (Ctrl+C):', code);
      });
    } else {
      prompt('Copiar código (Ctrl+C):', code);
    }
  }

  function editCandidato(index) {
    const c = candidatos[index];
    nomeEl.value = c.nome;
    idadeEl.value = c.idade;
    biEl.value = c.bi;
    contactoEl.value = c.contacto;
    cursoEl.value = c.curso;
    estadoEl.value = c.estado;
    candidatos.splice(index, 1);
    listar();
    atualizarDashboard();
  }

  function deleteCandidato(index) {
    if (confirm('Tem certeza que deseja apagar este candidato?')) {
      candidatos.splice(index, 1);
      listar();
      atualizarDashboard();
    }
  }

  function atualizarCursos() {
    filtroCursoEl.innerHTML = '<option value="">Todos os Cursos</option>';
    const cursosUnicos = [...new Set(candidatos.map(c => c.curso))];
    cursosUnicos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso;
      option.textContent = curso;
      filtroCursoEl.appendChild(option);
    });
  }

  function aplicarFiltro() {
    const curso = filtroCursoEl.value;
    const estado = filtroEstadoEl.value;
    
    tabelaRelatorioEl.innerHTML = '';
    candidatos
      .filter(c => !curso || c.curso === curso)
      .filter(c => !estado || c.estado === estado)
      .forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${c.nome}</td>
          <td>${c.idade}</td>
          <td>${c.bi}</td>
          <td>${c.contacto}</td>
          <td>${c.curso}</td>
          <td>${c.codigo}</td>
          <td>${c.estado}</td>
        `;
        tabelaRelatorioEl.appendChild(row);
      });
  }

  function atualizarDashboard() {
    totalEl.textContent = candidatos.length;
    aprovadosEl.textContent = candidatos.filter(c => c.estado === 'Aprovado').length;
    reprovadosEl.textContent = candidatos.filter(c => c.estado === 'Reprovado').length;
    pendentesEl.textContent = candidatos.filter(c => c.estado === 'Pendente').length;

    resumoCursosEl.innerHTML = '';
    const cursos = {};
    candidatos.forEach(c => {
      cursos[c.curso] = (cursos[c.curso] || 0) + 1;
    });
    
    if (Object.keys(cursos).length === 0) {
      const li = document.createElement('li');
      li.textContent = 'Nenhum candidato registado';
      resumoCursosEl.appendChild(li);
    } else {
      Object.keys(cursos).forEach(curso => {
        const li = document.createElement('li');
        li.textContent = `${curso}: ${cursos[curso]} candidato(s)`;
        resumoCursosEl.appendChild(li);
      });
    }

    atualizarCursos();
  }

  function searchStudentResult() {
    const code = studentCode.value.trim();
    const candidate = candidatos.find(c => c.codigo === code);
    const resultsDiv = document.getElementById('studentResults');
    const noResults = document.getElementById('noResults');

    if (candidate) {
      document.getElementById('sNome').textContent = candidate.nome;
      document.getElementById('sBI').textContent = candidate.bi;
      document.getElementById('sCurso').textContent = candidate.curso;
      document.getElementById('sMedia').textContent = candidate.media.toFixed(2);
      
      const statusEl = document.getElementById('sStatus');
      statusEl.innerHTML = `<span class="status-badge ${candidate.estado.toLowerCase()}">${candidate.estado}</span>`;
      
      resultsDiv.classList.remove('hidden');
      noResults.classList.add('hidden');
    } else {
      alert('Código de acesso não encontrado');
      resultsDiv.classList.add('hidden');
      noResults.classList.remove('hidden');
    }
  }

  function gerarPDF() {
    const curso = filtroCursoEl.value;
    const estado = filtroEstadoEl.value;
    
    let filtered = candidatos
      .filter(c => !curso || c.curso === curso)
      .filter(c => !estado || c.estado === estado);

    if (filtered.length === 0) {
      alert('Nenhum candidato para exportar');
      return;
    }

    let content = 'RELATÓRIO DE CANDIDATOS\n';
    content += 'Gerado em: ' + new Date().toLocaleDateString('pt-PT') + '\n';
    content += '=' .repeat(50) + '\n\n';
    
    filtered.forEach((c, i) => {
      content += `${i + 1}. Nome: ${c.nome}\n`;
      content += `   Idade: ${c.idade}\n`;
      content += `   BI: ${c.bi}\n`;
      content += `   Contacto: ${c.contacto}\n`;
      content += `   Curso: ${c.curso}\n`;
      content += `   Código: ${c.codigo}\n`;
      content += `   Média: ${c.media.toFixed(2)}\n`;
      content += `   Estado: ${c.estado}\n`;
      content += '---\n\n';
    });

    content += '=' .repeat(50) + '\n';
    content += `Total de candidatos: ${filtered.length}\n`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', 'relatorio.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
