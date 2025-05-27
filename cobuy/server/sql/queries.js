module.exports = {
  // ======== 使用者 Users ========
  createUser: `
    INSERT INTO users (username, nickname, real_name, password, email, school, student_id, dorm, score, phone)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `,
  loginUser: `
    SELECT * FROM users WHERE username = $1 AND password = $2
  `,
  getUserProfile: `
    SELECT username, nickname, real_name, email, dorm, score, phone
    FROM users
    WHERE username = $1
  `,
  updateUserProfile: `
    UPDATE users
    SET
      real_name = $2,
      email = $3,
      school = $4,
      student_id = $5,
      dorm = $6
    WHERE username = $1;
  `,

  // title, description, creator_id, limit_count, deadline
  // ======== 開團 Orders ========
  createOrder: `
    INSERT INTO orders (
      order_id, host_username, item_name, quantity, total_price,
      unit_price, image_url, information, share_method, share_location,
      stop_at_num, stop_at_date, comment, hashtag, pay_method, label
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16
    )
  `
,
  getAllOrders: `
    SELECT * FROM orders ORDER BY order_id DESC
  `,
  getOrderById: `
    SELECT * FROM orders WHERE order_id = $1
  `,
  getOrdersByUser: `
    SELECT * FROM orders WHERE host_username = $1
  `,
  getAllOrdersWithFilter: `
    SELECT * FROM orders
    WHERE
      ($1::text IS NULL OR item_name ILIKE '%' || $1 || '%')
      AND ($2::text IS NULL OR hashtag ILIKE '%' || $2 || '%')
    ORDER BY order_id DESC
    LIMIT $3 OFFSET $4
  `,
  getPopularTags: `
    SELECT unnest(string_to_array(hashtag, ' ')) AS tag, COUNT(*) AS cnt
    FROM orders
    GROUP BY tag
    ORDER BY cnt DESC
    LIMIT 5
  `,


  // ======== 留言 OrderComment ========
  createComment: `
    INSERT INTO ordercomment (order_id, username, message, created_at)
    VALUES ($1, $2, $3, NOW())
  `,
  getCommentsByOrder: `
    SELECT * FROM ordercomment
    WHERE order_id = $1
    ORDER BY created_at ASC
  `,

  // ======== 參與訂單 JoinedOrder ========
  joinOrder: `
    INSERT INTO joined_order (username, order_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (username, order_id) DO UPDATE
    SET quantity = EXCLUDED.quantity
  `,
  getParticipantsByOrder: `
    SELECT jo.username, u.phone, jo.quantity, u.score
    FROM joined_order jo
    JOIN users u ON jo.username = u.username
    WHERE jo.order_id = $1
  `,
  
  getOrdersJoinedByUser: `
    SELECT o.*, jo.quantity
    FROM joined_order jo
    JOIN orders o ON jo.order_id = o.order_id
    WHERE jo.username = $1
  `,

  // ======== 宿舍 Dorm ========
  getAllDorms: `
    SELECT * FROM dorm ORDER BY dorm_name
  `,
  getDormArea: `
    SELECT area FROM dorm WHERE dorm_name = $1
  `,

  // ======== 統計用 ========
  getOrderParticipantCount: `
    SELECT order_id, COUNT(*) AS participant_count
    FROM joined_order
    GROUP BY order_id
  `,
  getUserOrderStats: `
    SELECT
      (SELECT COUNT(*) FROM orders WHERE host_username = $1) AS created_orders,
      (SELECT COUNT(*) FROM joined_order WHERE username = $1) AS joined_orders
  `,

  // ======== 棄單相關 =========
  insertAbandonReport: `
    INSERT INTO abandon_report (
      reporter_username, target_username, order_id,
      reason, reported_at, status
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `
};