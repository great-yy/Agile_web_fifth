describe('todo', function () {
    let page;

    before (async function () {
      page = await browser.newPage();
      await page.goto('http://127.0.0.1:7001/');
    });
  
    after (async function () {
      await page.close();
    });

    it('should have correct title', async function() {
        expect(await page.title()).to.eql('Koa • Todo');
    })

    it('should have correct num', async function() {
      const ListNum = await page.evaluate(() => {
          return document.getElementsByClassName('view').length;
      });
      const doneListNum = await page.evaluate(() => {
          return document.getElementsByClassName('completed').length;
      });
      let todoNum = await page.waitFor('#todo-count');
      const num = await page.evaluate(todoNum => todoNum.querySelector('strong').textContent, todoNum)
      expect(ListNum - doneListNum).to.eql(+num);
    })

    it('should new todo correct', async function() {
      await page.click('#new-todo', {delay: 500});
      await page.type('#new-todo', 'new todo item', {delay: 50});
      await page.keyboard.press("Enter");
      let todoList = await page.waitFor('#todo-list');
      const expectInputContent = await page.evaluate(todoList => todoList.lastChild.querySelector('label').textContent, todoList);
      expect(expectInputContent).to.eql('new todo item');
    }) 

    it('should done todo correct', async function() {
      page.evaluate(() => {
        let events = document.getElementsByClassName('toggle');
        events[events.length - 1].click();
        console.log(events.length - 1);
      });
      let todoList = await page.waitFor('#todo-list');
      const expectStatus = await page.evaluate(todoList => todoList.lastChild.querySelector('input').checked, todoList);
      expect(expectStatus).to.eql(true);
    })
    
  });