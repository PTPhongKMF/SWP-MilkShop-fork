import React, { useEffect, useState } from "react";
import he from 'he';
import { useParams } from "react-router-dom";
import { blogDetail } from "../../services/blog/blogDetail"; // Adjust the path as per your structure
import "./BlogDetail.css";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import ProductList from "../Product/ProductList";
import BlogList from "./BlogList";

const BlogDetail = ({ isMember }) => {
  const { BlogID } = useParams(); // Get the BlogID parameter from the URL
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  const getImageSrc = (imageData) => {
    if (!imageData || !imageData.data) return '';

    try {
      const base64 = btoa(
        imageData.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image data:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogDetail(BlogID); // Use the BlogID from useParams
        setBlog(data.blog);
        setRelatedProduct(data.blogProducts);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBlog();
  }, [BlogID]);

  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Loading...</div>; // Add a loading state

  return (
    <>
      <img className="image" src="/img/milkbuying.jpeg" alt="Blog Header" />
      <Header isMember={isMember} />
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="blog-detail">
              <h1>{blog.Title}</h1>
              <div className="blog-meta">
                <span className="blog-date">
                  {formatDate(blog.updated)}
                </span>
                <span className="blog-author">{blog.Author}</span>
              </div>
              <div className="blog-content">
                {/* <p>{blog.Content}</p> */}
                <div dangerouslySetInnerHTML={{ __html: he.decode(blog.Content) }}></div>
              </div>
              <div className="blog-detail-image">
                <img src={`data:image/jpeg;base64,${blog.Image}`} />
              </div>


            </div>
          </div>
          <div className="col-lg-4 blogDetail">
            <BlogList columnLayout />
          </div>
        </div>
      </div>
      {relatedProduct.length > 0 && <ProductList products={relatedProduct || []} />}
      <Footer />
    </>
  );
};

export default BlogDetail;
