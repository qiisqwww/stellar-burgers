import { deleteCookie, setCookie } from './../../src/utils/cookie';

const URL = 'https://norma.nomoreparties.space/api';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    setCookie('accessToken', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjBhMDAyOTdlZGUwMDAxZDA2MDg1NCIsImlhdCI6MTcxMjMxMDE2NiwiZXhwIjoxNzEyMzExMzY2fQ.v7kdecJvLfdmlBsvf_BySvsfnXX3K0Er__GNYw-NRLM');
    localStorage.setItem('refreshToken', '9cbdd5b777edfb92bd9183a7cf2372a12b545c045a9796f94c1afd0b9d374a8794aa15bee20a7556');
    cy.intercept('GET', `${URL}//auth/user`, {fixture: 'user.json'}).as('getUser');
    cy.intercept('GET', `${URL}/ingredients`, {fixture: 'ingredients.json'}).as('getIngredients');

    cy.visit('');
    cy.wait('@getUser');
  });
  afterEach(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
  it('Получение списка ингредиентов через API', () => {
    cy.get('[data-cy="constructor"]').as('constructor');

    cy.addIngredient('Булки');
    cy.addIngredient('Начинки');

    cy.get('@constructor').should('contain', 'Краторная булка N-200i');
    cy.get('@constructor').should('contain', 'Биокотлета из марсианской Магнолии');
  });
  it('Открытие и закрытие окна ингредиента', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', 'Краторная булка N-200i');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('@modal').should('exist');

    cy.get('[data-cy="modal-overlay"]').click('left', {force: true});
    cy.get('@modal').should('not.exist');
  });
  it('Создание заказа', () => {
    cy.intercept('POST', `${URL}/orders`, (req) => {
        console.log('Intercepted order request', req);
        req.reply({ fixture: 'order.json' });
    }).as('orderBurgerApi');

    cy.get('[data-cy="constructor"]').as('constructor');

    cy.addIngredient('Булки');
    cy.addIngredient('Начинки');

    cy.get('@constructor').children('div').children('button').click();

    cy.wait('@orderBurgerApi', { timeout: 15000 });

    cy.get('[data-cy="modal"]').as('modal');
    cy.get('@modal').should('exist');
    cy.get('@modal').should('contain', '66666');

    cy.get('[data-cy="modal-close"]').click();
    cy.get('@modal').should('not.exist');

    cy.get('@constructor').should('not.contain', 'Биокотлета из марсианской Магнолии');
    cy.get('@constructor').should('not.contain', 'Краторная булка N-200i');
    });
});
