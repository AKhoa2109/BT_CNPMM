import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spin, Typography, Pagination, Empty } from "antd";
import { getProductsApi } from "../util/api";

const { Title } = Typography;

export default function ProductsPage() {
  const { id } = useParams(); // category id

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3); // mỗi trang 3 sản phẩm
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);
  const lastInteractionRef = useRef("manual");
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const fetchProducts = useCallback(
    async (pageNum = 1, { append = false } = {}) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);

        const res = await getProductsApi(id, pageNum, pageSize);
        if (!mountedRef.current) return;

        // API trả về res.data.data
        const data = res?.data;
        const fetched = data?.products || [];
        console.log("fetchProducts:", { fetched, pageNum, append });

        if (append) {
          setProducts((prev) => [...prev, ...fetched]);
        } else {
          setProducts(fetched);
        }

        if (typeof data?.total !== "undefined") setTotalItems(data.total);
        if (typeof data?.totalPages !== "undefined") setTotalPages(data.totalPages);
      } catch (err) {
        console.error("fetchProducts error:", err);
      } finally {
        if (!mountedRef.current) return;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [id, pageSize]
  );

  // Khi đổi category: reset và tải trang 1
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setTotalItems(0);
    setTotalPages(1);
    lastInteractionRef.current = "manual";
    fetchProducts(1, { append: false });
  }, [id, fetchProducts]);

  // Khi đổi page
  useEffect(() => {
    if (page === 1) return;
    const isInfinite = lastInteractionRef.current === "infinite";
    fetchProducts(page, { append: isInfinite });
  }, [page, fetchProducts]);

  // Lazy loading bằng IntersectionObserver
  const lastProductRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && page < totalPages) {
            lastInteractionRef.current = "infinite";
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, loadingMore, page, totalPages]
  );

  // Xử lý khi nhấn Pagination
  const onPageChange = (p) => {
    lastInteractionRef.current = "manual";
    setProducts([]); // xoá dữ liệu cũ
    setPage(p);
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Danh sách sản phẩm</Title>

      <Row gutter={[16, 16]}>
        {products.map((prod, index) => {
          const isLast = index === products.length - 1;
          const key = prod._id;

          const CardContent = (
            <Card
              hoverable
              key={key}
              title={prod.name}
              cover={
                <img
                  style={{ height: 180, objectFit: "cover" }}
                  alt={prod.name}
                  src={prod.image}
                />
              }
            >
              <p style={{ minHeight: 48 }}>{prod.description}</p>
            </Card>
          );

          if (isLast) {
            return (
              <Col xs={24} sm={12} md={8} lg={6} key={key} ref={lastProductRef}>
                {CardContent}
              </Col>
            );
          }

          return (
            <Col xs={24} sm={12} md={8} lg={6} key={key}>
              {CardContent}
            </Col>
          );
        })}
      </Row>

      {(loading || loadingMore) && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin />
        </div>
      )}

      {!loading && products.length === 0 && (
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
          showSizeChanger={false} // cố định 3 sp/trang
          showQuickJumper
        />
      </div>
    </div>
  );
}
