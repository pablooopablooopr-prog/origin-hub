
-- Allow customers to INSERT order_items for their own orders
CREATE POLICY "order_items_customer_insert_own"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.id = order_items.order_id
      AND c.user_id = auth.uid()
  )
);

-- Allow customers to DELETE their own pending orders (for rollback on checkout failure)
CREATE POLICY "orders_customer_delete_own_pending"
ON public.orders
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM customers c
    WHERE c.id = orders.customer_id
      AND c.user_id = auth.uid()
  )
  AND payment_status = 'pending'
  AND status = 'pending'
);

-- Allow customers to DELETE order_items for their own pending orders (for rollback)
CREATE POLICY "order_items_customer_delete_own_pending"
ON public.order_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.id = order_items.order_id
      AND c.user_id = auth.uid()
      AND o.payment_status = 'pending'
      AND o.status = 'pending'
  )
);
