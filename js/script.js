let globalUsers = [];
let filteredUsers = [];

let numberFormat = null;

let inputFilter = document.querySelector('#inputFilter');
let buttonFilter = document.querySelector('#buttonFilter');
let tabPeople = document.querySelector('#tab-people');
let tabStatistics = document.querySelector('#tab-statistics');
let txtUsers = document.querySelector('#text-users');
let txtStatistics = document.querySelector('#text-statistics');

async function star() {
  await fetchUsers();

  hideSpinner();
}

inputFilter.addEventListener('keyup', function events(e) {
  checkInput();
  if (
    inputFilter.value.length > 0 &&
    e.keyCode === 13 &&
    inputFilter.value.trim(' ')
  ) {
    doSearch();
  }
});

buttonFilter.addEventListener('click', doSearch);

async function fetchUsers() {
  const resource = await fetch('http://localhost:3001/results');
  const json = await resource.json();

  globalUsers = json.map(({ name, picture, gender, dob, login }) => {
    return {
      userId: login.uuid,
      userGender: gender,
      userName: name.first + ' ' + name.last,
      userPicture: picture.large,
      userAge: dob.age,
    };
  });
  globalUsers.sort((a, b) => {
    return a.userName.localeCompare(b.userName);
  });
}

function checkInput() {
  if (inputFilter.value.length > 0 && inputFilter.value.trim(' ')) {
    buttonFilter.disabled = false;
  } else {
    buttonFilter.disabled = true;
  }
}

function doSearch() {
  filteredUsers = globalUsers.filter((person) => {
    return person.userName
      .toLowerCase()
      .includes(inputFilter.value.toLowerCase());
  });
  renderFilteredPeople();
  renderStatistics();
}

function hideSpinner() {
  const spinner = document.querySelector('#spinner');

  spinner.classList.add('hide');
}

function renderFilteredPeople() {
  let peopleHTML = '<div>';

  filteredUsers.forEach((person) => {
    const { userPicture, userName, userAge } = person;

    const personHTML = `
    <div class='person'>
      <div id="profile">
      <br>
        <img src="${userPicture}" alt="${userName}" id=imgs>
        <ul>
          <li>${userName}, ${userAge} anos</li>
        <ul>
    </div>
    `;

    peopleHTML += personHTML;
  });

  peopleHTML += '</div>';

  tabPeople.innerHTML = peopleHTML;
  updateHtml(filteredUsers.length);
}

function renderStatistics() {
  tabStatistics.innerHTML = '';

  let statistics = document.createElement('div');

  if (filteredUsers.length !== 0) {
    let statisticsMale = document.createElement('div');
    const totalMale = filteredUsers.reduce(
      (accumulator, current) =>
        current.userGender === 'male' ? ++accumulator : accumulator,
      0
    );
    statisticsMale.textContent = `Sexo masculino: ${totalMale}`;
    statistics.appendChild(statisticsMale);

    let statisticsFemale = document.createElement('div');
    const totalFemale = filteredUsers.reduce(
      (accumulator, current) =>
        current.userGender === 'female' ? ++accumulator : accumulator,
      0
    );
    statisticsFemale.textContent = `Sexo feminino: ${totalFemale}`;
    statistics.appendChild(statisticsFemale);

    let statisticsTotalAge = document.createElement('div');
    const totalAges = filteredUsers.reduce((accumulator, current) => {
      return accumulator + current.userAge;
    }, 0);
    statisticsTotalAge.textContent = `Soma das idades: ${totalAges}`;
    statistics.appendChild(statisticsTotalAge);

    let statisticsAvgAge = document.createElement('div');
    const avgAges = totalAges / filteredUsers.length;
    statisticsAvgAge.textContent = `Média das idades: ${avgAges.toFixed(2)}`;
    statistics.appendChild(statisticsAvgAge);
  }

  tabStatistics.appendChild(statistics);
}

function updateHtml(users) {
  if (users === 0) {
    txtUsers.textContent = 'Nenhum usuário filtrado';
    txtStatistics.textContent = 'Nada a ser exibido';
  } else {
    txtUsers.textContent = '';
    txtStatistics.textContent = '';
    txtUsers.innerHTML = `${users} usuário(s) encontrado(s)`;
    txtStatistics.innerHTML = 'Estatísticas';
  }
}

star();
