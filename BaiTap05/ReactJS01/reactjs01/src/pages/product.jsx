import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spin, Typography, Pagination, Empty } from "antd";
import { getProductsApi } from "../util/api";

const { Title } = Typography;

export default function ProductsPage() {
  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getProductsApi(id, page, pageSize);
        
        if (!mountedRef.current) return;

        const responseData = res;
        if (responseData?.EC === 0) {
          const data = responseData.data;
          const fetched = data?.products || [];
          
          setProducts(fetched);
          setTotalItems(data?.total || 0);
        }
      } catch (err) {
        console.error("fetchProducts error:", err);
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id, page, pageSize]);

  const onPageChange = (p) => {
    setPage(p);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Danh sách sản phẩm</Title>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((prod) => (
              <Col xs={24} sm={12} md={8} lg={6} key={prod._id}>
                <Card
                  hoverable
                  title={prod.name}
                  cover={
                    <img
                      style={{ height: 180, objectFit: "contain" }}
                      alt={prod.name}
                      src={prod.image}
                    />
                  }
                >
                  <p style={{ minHeight: 48 }}>Giá: {prod.price} đồng</p>
                  <p style={{ minHeight: 48 }}>{prod.description}</p>
                </Card>
              </Col>
            ))}
          </Row>

          {products.length === 0 && (
            <div style={{ marginTop: 40 }}>
              <Empty description="Không có sản phẩm" />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalItems}
              onChange={onPageChange}
              showSizeChanger={false}
              showQuickJumper
            />
          </div>
        </>
      )}
    </div>
  );
}