import { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Typography, Input } from "antd";
import axios from "../util/axios.customize";
import { CrownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllCategoriesApi } from "../util/api";

const { Title } = Typography;
const { Search } = Input;

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getAllCategoriesApi();
    if (res && res.data) {
      setCategories(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleClickCategory = (catId) => {
    const page = 1;
    const limit = 3;
    navigate(`/products/by-category/${catId}?page=${page}&limit=${limit}`);
  };

  const handleSearch = (value) => {
    if (value && value.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <CrownOutlined style={{ fontSize: 40, color: "#fadb14" }} />
        <Title level={3}>Danh mục sản phẩm</Title>
      </div>

      {/* Ô search */}
      <div style={{ maxWidth: 400, margin: "0 auto 30px" }}>
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          enterButton
          onSearch={handleSearch}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {categories.map((cat) => (
            <Col xs={24} sm={12} md={8} lg={6} key={cat._id}>
              <Card
                hoverable
                title={cat.name}
                style={{ borderRadius: 8 }}
                onClick={() => handleClickCategory(cat._id)}
                cover={
                  <img
                    style={{ height: 180, objectFit: "contain" }}
                    alt={cat.name}
                    src={cat.image}
                  />
                }
              >
                <p>{cat.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomePage;
