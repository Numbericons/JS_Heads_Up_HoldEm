import Table from './pokerLogic/table';

$(() => {
  const actionsCont = $('.table-bottom-actions');
  const table = new Table(actionsCont);
  table.setup();
});



