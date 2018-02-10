const expect = require('expect');
const {ObjectID} = require('mongodb');
const bodyParser = require('body-parser');
const request = require('supertest');

const {app} = require('./../server');
const {Movie} = require('./../../models/movie');
const {Comment} = require('./../../models/comment');
const {populateComments, populateMovies, movies, comments} =
    require('./seed')

app.use(bodyParser.json());

beforeEach(populateMovies);
beforeEach(populateComments);

describe('****MOVIES****', () => {
    describe('POST /movies', () => {
        it('should add new movie', (done) => {
            const movie = {
                Title: 'Test movie'
            };

            request(app)
            .post('/movies')
            .send(movie)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done();
                }
                Movie.find(movie).then((movies) => {
                    expect(movies.length).toBe(3);
                    expect(movies[0].Title).toBe(movie.Title);
                    done();
                }).catch((e) => done());
            })
        });

        it('should not add movie without Title', (done) => {
            request(app)
            .post('/movies')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done();
                }
                Movie.find().then((movies) => {
                    expect(movies.length).toBe(2);
                    done();
                }).catch((e) => done());
            });
        });

        it('should not add existing movie', (done) => {
            request(app)
            .post('/movies')
            .send({Title: movies[0].Title})
            .expect(200)
            .end((err, res) => {
                if(err) {
                    return done();
                }
                Movie.find().then((movies) => {
                    expect(movies.length).toBe(2);
                    done();
                }).catch((e) => done());
            });
        });
    });

    describe('GET /movies', () => {
        it('should return all movies', (done) => {
            request(app)
            .get('/movies')
            .expect(200)
            .expect((res) => {
                expect(res.body.movies.length).toBe(2);
            })
            .end(done);
        });

        describe('GET /movies with params', () => {
            it('should return movies by "Drama" Genre', (done) => {
                request(app)
                .get('/movies/param?genre=Drama')
                .expect(200)
                .expect((res) => {
                    expect(res.body.movies.length).toBe(1);
                })
                .end(done);
            });

            it('should not return movies by "SF" Genre', (done) => {
                request(app)
                .get('/movies/param?genre=SF')
                .expect(200)
                .expect((res) => {
                    expect(res.body.movies.length).toBe(0);
                })
                .end(done);
            });
        });
    });
});

describe('****COMMENTS****', () => {
    describe('POST /comments', () => {
        it('should add comment', (done) => {
            const comment = {
                Content: 'test comment',
                Author: 'Me',
                _movieId: movies[0]._movieId
            }

            request(app)
            .post('/comments')
            .send(comment)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done();
                }
                Comment.find(comment).then((comments) => {
                    expect(comments.length).toBe(1);
                    expect(comments[0].Content).toBe(comment.Content);
                    done();
                }).catch((e) => done());
            })
        });

        it('should not add com. with non-existing valid movie ID', (done) => {
            const comment = {
                Content: 'test comment',
                Author: 'Me',
                _movieId: new ObjectID()
            }
            request(app)
            .post('/comments')
            .send(comment)
            .expect(400)
            .end(done);
        });

        it('should not add com. with invalid movie ID', (done) => {
            const comment = {
                Content: 'test comment',
                Author: 'Me',
                _movieId: '123'
            }
            request(app)
            .post('/comments')
            .send(comment)
            .expect(404)
            .end(done);
        });
    });

    describe('GET /comments', () => {
        it('should return all comments', (done) => {
            request(app)
            .get('/comments')
            .expect(200)
            .expect((res) => {
                expect(res.body.comment.length).toBe(3);                
            })
            .end(done);
        });   

        describe('GET /comments with params', () => {
            it('should return comments for movieId', (done) => {
                movieId = movies[0]._id
                request(app)
                .get(`/comments/${movieId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.comment.length).toBe(2);
                })
                .end(done);
            });

            it('should not return com. for invalid movieId', (done) => {
                movieId = '123'
                request(app)
                .get(`/comments/${movieId}`)
                .expect(400)
                .end(done);
            });

            it('should not return com. for non-ex. valid movieId', (done) => {
                movieId = new ObjectID()
                request(app)
                .get(`/comments/${movieId}`)
                .expect(404)
                .end(done);
            });
        });
    });
});



