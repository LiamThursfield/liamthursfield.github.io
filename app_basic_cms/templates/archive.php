<?php include "templates/include/header.php" ?>

      <div class="article_list archive_list">
         
         <p class="total">
            <?php echo $results['totalRows']?> article<?php echo ($results['totalRows'] != 1) ? 's' : ''?> in total.
          </p>
         
          <ul id="headlines">
        <?php foreach ($results['articles'] as $article) { ?>
          <li>
            <h2>
              <span class="pubDate">
                <?php echo date('j F Y', $article->publicationDate)?>
              </span>
              <a href=".?action=viewArticle&amp;articleId<?php echo $article->id ?>">
                <?php echo htmlspecialchars($article->title) ?>
              </a>
            </h2>
            <p class="summary">
              <?php echo htmlspecialchars($article->summary)?>
            </p>
          </li>
        <?php }?>
      </ul>
      </div>

      <p class="bottom">
        <a href="./">Return to Homepage</a>
      </p>

      

      <?php include "templates/include/footer.php" ?>
