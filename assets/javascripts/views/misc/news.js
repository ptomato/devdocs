//= require views/misc/notif

app.views.News = class News extends app.views.Notif {
  static initClass() {
    this.className += ' _notif-news';

    this.defautOptions = {
      autoHide: 30000
    };

    return this;
  }

  constructor(...args) {
    super(...args);

    this.unreadNews = this.getUnreadNews();

    if (this.unreadNews.length) {
      this.show();
    }

    this.markAllAsRead();
  }

  render() {
    this.html(app.templates.notifNews(this.unreadNews));
  }

  getUnreadNews() {
    let time;
    if (!(time = this.getLastReadTime())) {
      return [];
    }

    return (() => {
      const result = [];
      for (let news of Array.from(app.news)) {
        if (new Date(news[0]).getTime() <= time) {
          break;
        }
        result.push(news);
      }
      return result;
    })();
  }

  getLastNewsTime() {
    return new Date(app.news[0][0]).getTime();
  }

  getLastReadTime() {
    return app.settings.get('news');
  }

  markAllAsRead() {
    app.settings.set('news', this.getLastNewsTime());
  }
}.initClass();
