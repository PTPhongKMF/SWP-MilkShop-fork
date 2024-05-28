
import PropTypes from 'prop-types';


const BlogCard = ({ title, authorName, authorDescription, authorImage }) => {
  return (
    <div className="blog-card">
      <blockquote>{title}</blockquote>
      <div className="author">
        <img src={authorImage} alt={`${authorName}`} className="author-image" />
        <div className="author-info">
          <h4>{authorName}</h4>
          <p>{authorDescription}</p>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  title: PropTypes.string,
  authorName: PropTypes.string,
  authorDescription: PropTypes.string,
  authorImage: PropTypes.string,
};

export default BlogCard;
