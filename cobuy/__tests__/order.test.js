// __tests__/order-create.test.js
const request = require('supertest');
const app = require('../server/app.js');
const pool = require('../server/db');
console.log('🧩 app 型別:', typeof app, app?.constructor?.name);


afterAll(async () => {
  await pool.end(); // 測試完釋放 DB 連線
});

describe('🧪 測試開團 API：POST /orders', () => {

  it('應該成功開團並回傳 201 與訊息', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        username: 'admin',
        item_name: '測試開團商品',
        quantity: 10,
        total_price: 1000,
        unit_price: 100,
        image_url: '',
        information: '這是測試用商品',
        share_method: '自取',
        share_location: '女二舍',
        stop_at_num: 3,
        stop_at_date: '2025-12-31',
        comment: '一起團購省運費',
        hashtag: '',
        pay_method: '現金',
        labels: '生活用品'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('開團成功');
  });

});
