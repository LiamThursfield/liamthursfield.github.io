<?php include "templates/include/header.php" ?>

  <div id="adminHeader">
    <h2>LT CMS Admin</h2>
    <p>You are logged in as <span class="username"><?php echo htmlspecialchars($_SESSION['username']) ?></span>,
      <a href="admin.php?action=logout"?>Log out</a></p>
    </p>
  </div>

  <div class="admin article_list">
      <h1>All Articles <span class="detail">[<?php echo $results['totalRows']?>]</span></h1>

  <?php if ( isset( $results['errorMessage'] ) ) { ?>
          <div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
  <?php } ?>


  <?php if ( isset( $results['statusMessage'] ) ) { ?>
          <div class="statusMessage"><?php echo $results['statusMessage'] ?></div>
  <?php } ?>

        <table>
          <tr>
            <th>Publication Date</th>
            <th>Article</th>
          </tr>

  <?php foreach ( $results['articles'] as $article ) { ?>

          <tr onclick="location='admin.php?action=editArticle&amp;articleId=<?php echo $article->id?>'">
            <td><?php echo date('j M Y', $article->publicationDate)?></td>
            <td>
              <?php echo $article->title?>
            </td>
          </tr>

  <?php } ?>

        </table>
  </div>

        <p class="bottom"><a href="admin.php?action=newArticle">Add a New Article</a></p>
<?php include "templates/include/footer.php" ?>
