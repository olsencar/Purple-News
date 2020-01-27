import React, { Component } from 'react';
import './App.css';
import ArticleGroup from './components/ArticleGroup.js';
import MainNavbar from './components/MainNavbar'
import articleService from './services/articleService';
import ReactPaginate from 'react-paginate';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articlesPerPage: 15,
      articlesToDisplay: [],
      offset: 0,
      article_data: [],
      comment_data: this.props.comment_data,
    };
  }

  componentWillMount() {
    this.getRecentArticles();
  }

  getArticleById = async (id) => {
    let res = await articleService.getArticleById(id);
    this.setState({item: res});
  }

  getArticle = async (title, description, source) => {
    let res = await articleService.getArticle(title, description, source);
    this.setState({item: res});
  }

  getRecentArticles = async () => {
    let res = await articleService.getRecentArticles();
    this.setState({
      article_data: res,
      pageCount: Math.ceil(res.length / this.state.articlesPerPage)
    }, () => this.setArticlesToDisplay());
  }

  handlePageClick = (data) => {
    const selected = data.selected;
    this.setState({
      offset: selected * this.state.articlesPerPage
    }, () => this.setArticlesToDisplay());
  }

  removeArticleGroup = (index) => {
    this.setState((prevState) => ({
      articlesToDisplay: prevState.articlesToDisplay.filter((_, i) => i !== index)
    }));
  }

  setArticlesToDisplay = () => {
    this.setState({
      articlesToDisplay: this.state.article_data.slice(this.state.offset, this.state.offset + this.state.articlesPerPage).map((article, index) => {
        // search for correct comment
        // iterate over each comment
        // default comment is null
        var group_comments = []
        for (var i = 0; i < this.props.comment_data.comments.length; i++){
          if (
            (this.props.comment_data.comments[i].primary_id === article._id) && (this.props.comment_data.comments[i].secondary_id === article.similar_articles[0]._id) ||
            (this.props.comment_data.comments[i].primary_id === article.similar_articles[0]._id) && (this.props.comment_data.comments[i].secondary_id === article._id)
            ){
            //set group comments to be the group of comments under this id pairing
            group_comments = this.props.comment_data.comments[i].group_comments
          }
        }
        return (
          <ArticleGroup key={index} id={index} article_data={article} comment_data={group_comments} removeArticleGroup={this.removeArticleGroup} />
        )
      })
    });
    window.scrollTo(0, 0);
  }

  render() {
    let paginationElement;
    if (this.state.pageCount > 1) {
      paginationElement = (
        <ReactPaginate
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          previousLabel={<span aria-hidden="true">&laquo;</span>}
          nextLabel={<span aria-hidden="true">&raquo;</span>}
          breakLabel={<span className="gap">...</span>}
          pageCount={this.state.pageCount}
          onPageChange={this.handlePageClick}
          containerClassName="pagination"
          disabledClassName="disabled"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
        />
      );
    }
    return (
      <div className="App">
        <MainNavbar />
        <div className="container">
          <div className="col"></div>
          <div className="col">
            {this.state.articlesToDisplay}
            {paginationElement}
          </div>
          <div className="col"></div>
        </div>
      </div>
    )
  }
}

export default App;
