import { FrickPage } from './app.po';

describe('frick App', () => {
  let page: FrickPage;

  beforeEach(() => {
    page = new FrickPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
