import { DataService } from "./data.service";
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";

describe('DataService Tests', () => {

  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  let testBooks: Book[] = [
    {
      "bookID": 2,
      "title": "Winnie-the-Pooh",
      "author": "A. A. Milne",
      "publicationYear": 1926
    },
    {
      "bookID": 3,
      "title": "Where the Wild Things Are",
      "author": "Maurice Sendak",
      "publicationYear": 1963
    },
    {
      "bookID": 4,
      "title": "The Hobbit",
      "author": "J. R. R. Tolkien",
      "publicationYear": 1937
    }
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DataService ]
    });

    dataService = TestBed.get(DataService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should GET all books', () => {
    dataService.getAllBooks()
      .subscribe((data: Book[]) => {
        expect(data.length).toBe(3);
      });

    let booksRequest: TestRequest = httpTestingController.expectOne('/api/books');
    expect(booksRequest.request.method).toEqual('GET');

    booksRequest.flush(testBooks);
  });

  it('should return a BookTrackerError', () => {
    dataService.getAllBooks()
      .subscribe(
        (data: Book[]) => fail('this should have been an error'),
        (err: BookTrackerError) => {
          expect(err.errorNumber).toEqual(100);
          expect(err.friendlyMessage).toEqual('An error occurred when retrieving data');
        }
      );

    let booksRequest: TestRequest = httpTestingController.expectOne('/api/books');

    booksRequest.flush('error', {
      status: 500,
      statusText: 'Server Error'
    })
  });
})
