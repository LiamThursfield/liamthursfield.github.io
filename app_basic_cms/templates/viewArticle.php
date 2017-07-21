<?php include "templates/include/header.php" ?>

  <div class="article_details">
      <h1>
        <?php echo htmlspecialchars($results['article']->title) ?>
      </h1>
      <div class="article_summary">
        <?php echo htmlspecialchars($results['article']->summary)?>
      </div>
      <p class=pubDate>
        Published on <?php echo date('j F Y', $results['article']->publicationDate)?>
      </p>
  </div>
  <div class="article_content">
    <?php echo $results['article']->content?>
  </div>
  

  <p class="bottom">
    <a href="./">Return to homepage</a>
  </p>

<?php include "templates/include/footer.php" ?>
