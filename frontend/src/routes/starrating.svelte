<script>
    let rating = 0;
    let hoverRating = 0;
  
    export let onRate = (value) => {}; //exportuje hodnotu do parentu
    
    function setRating(value) {
      rating = value;
      onRate(value);
    }

    function setHover(value) {
      hoverRating = value;
    } //docasna hodnota pro hover
  
    function resetHover() {
      hoverRating = 0;
    }
  </script>

<div class="container">
    <div class="stars">
        {#each [1, 2, 3, 4, 5] as num (num)} <!--array hvezdicek-->
          <span
            class="star {hoverRating >= num || (!hoverRating && rating >= num) ? 'filled' : ''}"
            on:click={() => setRating(num)}
            on:mouseover={() => setHover(num)}
            on:mouseout={resetHover}
          >&#9733;</span> <!--pokud je hoverRating >= vybranymu cislu 1-5, nebo je rating vyberan jako >= num, tak se prekresli na filled, jinak nic-->
        {/each}
      </div>      
</div>

<style>
    .star {
      font-size: 2em;
      color: lightgray;
      cursor: pointer;
    }
  
    .star.filled {
      color: gold;
    }
  
    .stars {
      display: inline-flex;
    }
  </style>