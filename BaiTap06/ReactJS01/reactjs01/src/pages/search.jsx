import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Input, Select, Slider, Button, Pagination, Typography, Spin } from "antd";
import { searchProductsApi, getAllCategoriesApi } from "../util/api";
import debounce from "lodash.debounce";
import { useLocation, useNavigate } from "react-router-dom";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialQ = params.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: undefined,
    priceRange: [0, 1000000],
    sortField: "_score",
    sortOrder: "desc",
  });

  // load danh mục
  useEffect(() => {
    getAllCategoriesApi().then((res) => {
      if (res && res.data) setCategories(res.data);
    });
  }, []);

  // hàm gọi search API
  const doSearch = async ({
    qText = q,
    pageNum = page,
    limitNum = limit,
    filtersObj = filters,
  } = {}) => {
    setLoading(true);
    try {
      const params = {
        q: qText,
        category: filtersObj.category,
        page: pageNum,
        limit: limitNum,
        priceMin: filtersObj.priceRange ? filtersObj.priceRange[0] : undefined,
        priceMax: filtersObj.priceRange ? filtersObj.priceRange[1] : undefined,
        sortField: filtersObj.sortField,
        sortOrder: filtersObj.sortOrder,
      };

      const res = await searchProductsApi(params);
      if (res && res.data && res.data.EC === 0) {
        const data = res.data.data;
        console.log("Products:", data.products);
        setResults(data.products || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
        setLimit(limitNum);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // khi vào trang lần đầu nếu có q từ URL → search
  useEffect(() => {
    if (initialQ) {
      doSearch({ qText: initialQ, pageNum: 1 });
    }
  }, [initialQ]);

  // debounce search input
  const debouncedSearch = useCallback(
    debounce((val) => {
      setPage(1);
      navigate(`/search?q=${encodeURIComponent(val)}`);
      doSearch({ qText: val, pageNum: 1 });
    }, 500),
    [filters]
  );

  const onSearchChange = (e) => {
    const val = e.target.value;
    setQ(val);
    debouncedSearch(val);
  };

  const onFilterApply = () => {
    setPage(1);
    doSearch({ pageNum: 1, filtersObj: filters });
  };

  const onPageChange = (p, pageSize) => {
    setPage(p);
    doSearch({ pageNum: p, limitNum: pageSize });
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Tìm kiếm sản phẩm</Title>

      <Row gutter={[16, 16]}>
        {/* Sidebar filter */}
        <Col xs={24} sm={24} md={6}>
          <Card>
            <div style={{ marginBottom: 12 }}>
              <Search
                placeholder="Tìm sản phẩm..."
                value={q}
                onChange={onSearchChange}
                enterButton
                onSearch={(val) => {
                  setQ(val);
                  navigate(`/search?q=${encodeURIComponent(val)}`);
                  doSearch({ qText: val, pageNum: 1 });
                }}
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Danh mục</label>
              <Select
                allowClear
                style={{ width: "100%" }}
                placeholder="Chọn danh mục"
                value={filters.category}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, category: val }))
                }
              >
                {categories.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Khoảng giá</label>
              <Slider
                range
                min={0}
                max={10000000}
                step={10000}
                value={filters.priceRange}
                onChange={(val) =>
                  setFilters((prev) => ({ ...prev, priceRange: val }))
                }
              />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label>Sắp xếp</label>
              <Select
                style={{ width: "100%" }}
                value={`${filters.sortField}-${filters.sortOrder}`}
                onChange={(val) => {
                  const [field, order] = val.split("-");
                  setFilters((prev) => ({
                    ...prev,
                    sortField: field,
                    sortOrder: order,
                  }));
                }}
              >
                <Option value="_score-desc">Phù hợp nhất</Option>
                <Option value="price-asc">Giá thấp → cao</Option>
                <Option value="price-desc">Giá cao → thấp</Option>
                <Option value="createdAt-desc">Mới nhất</Option>
              </Select>
            </div>

            <Button type="primary" block onClick={onFilterApply}>
              Áp dụng
            </Button>
          </Card>
        </Col>

        {/* Result list */}
        <Col xs={24} sm={24} md={18}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spin />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]}>
                {results.map((p) => (
                    <Col key={p.id} xs={24} sm={12} md={8}>
                        <Card
                        hoverable
                        cover={
                            <img
                            alt={p.name}
                            src={p.image || "https://via.placeholder.com/200"}
                            style={{ height: 180, objectFit: "cover" }}
                            />
                        }
                        >
                        <Card.Meta
                            title={p.name}
                            description={
                            <>
                                <div>Giá: {p.price?.toLocaleString()} VND</div>
                                {p.categoryName && <div>Danh mục: {p.categoryName}</div>}
                                <div>Điểm tìm kiếm: {p.score?.toFixed(2)}</div>
                            </>
                            }
                        />
                        </Card>
                    </Col>
                ))}
              </Row>

              <div style={{ textAlign: "center", marginTop: 20 }}>
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={total}
                  onChange={onPageChange}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SearchPage;
