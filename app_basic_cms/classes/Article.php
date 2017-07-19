<?php

/**
* Class to handle articles
*/

class Article {
  // properties
  /**
  * @var int - The article ID from the database
  */
  public $id = null;

  /**
  * @var int - When the article was published
  */
  public $publicationDate = null;

  /**
  * @var string - Full title of the article
  */
  public $title = null;

  /**
  * @var string - A short summary of the article
  */
  public $summary = null;

  /**
  * @var string - the html content of the article
  */
  public $content = null;


/**
* Sets the object's properties using the values in the supplied array
*
* @param assoc - The property values
*/
public function __construct($data=array()) {
  if (isset($data['id']))  $this->id = (int) $data['id'];
  if (isset($data['publicationDate']))  $this->publicationDate = (int) $data['publicationDate'];
  if (isset($data['title']))  $this->title = preg_replace(
                                              '/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/', // reg exp to match
                                              '', // replace with '' (nothing)
                                              $data['title']); // string to replace
  if (isset($data['summary']))  $this->summary = preg_replace(
                                              '/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/', // reg exp to match
                                              '', // replace with '' (nothing)
                                              $data['summary']); // string to replace
  if (isset($data['content']))  $this->content = $data['content'];
} // end of constructor


/**
* Sets the object's properties using the edit form POST values supplied in the array
*
* @param assoc - The property values
*/
public function storeFormValues($params) {
  // store all the parameters
  $this->__construct($params);

  // parse and store the publication date
  if (isset($params['publicationDate'])) {
    $publicationDate = explode('-', $params['publicationDate']);

    if (count($publicationDate) == 3) {
      list($y, $m, $d) = $publicationDate;
      $this->publicationDate = mktime(0, 0, 0, $m, $d, $y);
    }
  }
} // end of function: storeFormValues()


/**
* Returns an Article object maching the given  article id
*
* @param int - The article id
* @return Article|false - The article object OR false if the record was not found/there was a probelm
*/
public static function getById($id) {
  $conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
  $sql = "SELECT *, UNIX_TIMESTAMP(publicationDate) AS publicationDate FROM articles WHERE id = :id";
  $statement = $conn->prepare($sql);
  $statement->bindValue(':id', $id, PDO::PARAM_INT);
  $statement->execute();
  $row = $statement->fetch();
  $conn = null;

  if ($row) return new Article($row);
} // end function: getById()


/**
* Returns all (or a range of) Article objects in the DB
*
* @param (Optional) int - The number of rows to return (default=all)
* @param (Optional) string - The column by wich to order the articles (default="publicationDate DESC")
* @return Article|false - A two-element array: results => array, a list of Article objects; totalRows => Total number of articles
*/
public static function getList($numRows=1000000, $order="publicationDate DESC") {
  $conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
  $sql = 'SELECT SQL_CALC_FOUND_ROWS *, UNIX_TIMESTAMP(publicationDate) AS publicationDate FROM articles
          ORDER BY ' . $conn->quote($order) . 'LIMIT :numRows';
  $statement = $conn->prepare($sql);
  $statement->bindValue(':numRows', $numRows, PDO::PARAM_INT);
  $statement->execute();
  $articleList = array();

  while ($row = $statement->fetch()) {
    $article = new Article($row); // create an Article from the row
    $articleList[] = $article; // ad the Article to the array
  }

  // Now get the total number of articles that matched the criteria
  $sql = 'SELECT FOUND_ROWS() AS totalRows';
  $totalRows = $conn->query($sql)->fetch();
  $conn = null;

  return(array(
    'results'=>$articleList,
    'totalRows'=>$totalRows[0]
  ));

} // end of function: getList()


/**
* Inserts the current Article object into the database, and sets its ID property.
*/

public function insert() {

  // Does the Article object already have an ID?
  if(!is_null($this->id)) {
    trigger_error('Article::insert(): Attempt to insert an Article object that
    has its ID property set (to $this->id).', E_USER_ERROR);
  }

  $conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
  $sql = "INSERT INTO articles (publicationDate, title, summary, content) VALUES (FROM_UNIXTIME(:publicationDate), :title, :summary, :content)";
  $statement = $conn->prepare($sql);
  $statement->bindValue(':publicationDate', $this->publicationDate, PDO::PARAM_INT);
  $statement->bindValue(':title', $this->title, PDO::PARAM_STR);
  $statement->bindValue(':summary', $this->summary, PDO::PARAM_STR);
  $statement->bindValue(':content', $this->content, PDO::PARAM_STR);
  $statement->execute();
  $this->id = $conn->lastInsertId();
  $conn = null;
} // end of function: insert()


/**
* Updates the current Article object on the database.
*/
public function update() {
  // Does the Article object have an ID?
  if (is_null($this->id)) {
    trigger_error('Article::update(): Attempt to update an Article object that does not have its ID property set.', E_USER_ERROR );
  }

  // update the Article
  $conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
  $sql = 'UPDATE articles SET
          publicationDate=FROM_UNIX_TIME(:publicationDate), title=:title, summary=:summary, content=:content
          WHERE id=:id';
  $statement = $conn->prepare($sql);
  $statement->bindValue(':publicationDate', $this->publicationDate, PDO::PARAM_INT);
  $statement->bindValue(':title', $this->title, PDO::PARAM_STR);
  $statement->bindValue(':summary', $this->summary, PDO::PARAM_STR);
  $statement->bindValue(':content', $this->content, PDO::PARAM_STR);
  $statement->bindValue(':id', $this->id, PDO_INT);
  $statement->execute();
  $conn = null;
} // end of function: update()


/**
* Deletes the current Article from the database.
*/
public function delete() {
  // Does the Article object have an ID?
  if (is_null($this->id)) {
    trigger_error('Article::delete(): Attempt to delete an Article object that does not have its ID property set.', E_USER_ERROR);
  }

  // Delete the Article
  $conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
  $sql = 'DELETE FROM articles WHERE id = :id LIMIT 1';
  $statement = $conn->prepare ($sql);
  $statement->bindValue(':id', $this->id, PDO::PARAM_INT);
  $statement->execute();
  $conn = null;
}

} // end of class: Article

?>
