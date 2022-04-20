/// <reference types="cypress" />

const santiago = {
  username: 'santiago',
  password: '123456',
};

const thomas = {
  username: 'thomas',
  password: '123456',
};

describe('Feature: Read Receipts', () => {
  it('has unread messages badge', () => {
    cy.login(santiago.username, santiago.password);

    const sidebar = cy.get('main > div:first-of-type');
    sidebar.contains(1);
  });

  it('unread messages badge updates on chat selection', () => {
    cy.login(santiago.username, santiago.password);

    const sidebar = cy.get('main > div:first-of-type');
    sidebar.contains(1).click();
    cy.get('main > div:first-of-type').should('not.contain', 1);
  });

  it('read messages persist on logout/login', () => {
    cy.login(santiago.username, santiago.password);

    const sidebar = cy.get('main > div:first-of-type');
    sidebar.should('not.contain', 1);
  });

  it('read messages have avatar under them', () => {
    cy.login(thomas.username, thomas.password);

    const sidebar = cy.get('main > div:first-of-type');
    sidebar.contains(santiago.username).click();

    const myMessage = cy.get(
      'main > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2)'
    );
    myMessage.get('[alt="santiago"]');
  });
});
