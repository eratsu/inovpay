document.addEventListener('DOMContentLoaded', function() {
  // Event listeners
  document.getElementById("val_compra").addEventListener("input", function() {
      this.value = formatCurrencyInput(this.value);
      updateValues();
  });

  document.getElementById("val_entrada").addEventListener("input", function() {
      this.value = formatCurrencyInput(this.value);
      updateValues();
  });

  document.getElementById("cartao_bandeira").addEventListener("change", function() {
      updateValues();
  });

  function updateValues() {
      var val_compra_input = document.getElementById("val_compra").value;
      var val_entrada_input = document.getElementById("val_entrada").value;

      // Verificar se val_compra está vazio
      if (val_compra_input.trim() === "") {
          document.getElementById("exibir").innerHTML = "";
          return;
      }

      var val_compra = parseCurrencyInput(val_compra_input);
      var val_entrada = parseCurrencyInput(val_entrada_input);

      // Corrigir para definir val_entrada como 0 se for NaN
      if (isNaN(val_entrada)) {
          val_entrada = 0;
      }

      var bandeira = document.getElementById("cartao_bandeira").value;

      var taxas;
      var taxa_debito;

      switch (bandeira) {
        case "mastervisa":
          taxas = [3.83, 5.61, 6.22, 6.85, 7.47, 8.00, 9.17, 9.70, 10.34, 10.91, 11.62, 11.99, 12.30, 12.76, 13.31, 13.87, 14.44, 14.91];
          taxa_debito = 1.61;
          break;
      case "outros":
          taxas = [4.05, 5.78, 6.39, 7.02, 7.54, 8.07, 9.59, 10.19, 10.79, 11.29, 12.09, 12.39, 12.71, 13.17, 13.62, 14.28, 14.75, 15.42];
          taxa_debito = 1.97;
          break;
      default:
          taxas = [4.05, 5.78, 6.39, 7.02, 7.54, 8.07, 9.59, 10.19, 10.79, 11.29, 12.09, 12.39, 12.71, 13.17, 13.62, 14.28, 14.75, 15.42];
          taxa_debito = 1.97;
          break;
      }

      var valor_parcelas = [];
      var valor_total = [];
      var valor = val_compra - val_entrada;

      let percentual_debito = (taxa_debito * valor) / 100;
      let debito_total = valor + percentual_debito;

      for (var i = 0; i < taxas.length; i++) {
          let percentual = (taxas[i] * valor) / 100;
          valor_total.push(valor + percentual);
          valor_parcelas.push((valor + percentual) / (i + 1));
      }

      var table = "";
      for (var i = 0; i < valor_parcelas.length; i++) {
          table += "<tr><td>" + (i + 1) + " x</td><td>" + formatCurrency(valor_parcelas[i]) + "</td><td>" + formatCurrency(valor_total[i]) + "</td></tr>";
      }

      var debito_linha = "<tr><td>Débito</td><td>" + formatCurrency(debito_total) + "</td><td>" + formatCurrency(debito_total) + "</td></tr>";

      document.getElementById("exibir").innerHTML = debito_linha + table;
  }

  function formatCurrencyInput(value) {
      // Remove caracteres não numéricos e formata para padrão de dinheiro
      var val = value.replace(/\D/g, '');
      if (val.length > 2) {
          val = val.replace(/(\d{2})$/, ',$1');
      } else if (val.length === 2) {
          val = ',' + val;
      }
      // Adiciona separadores de milhar
      val = val.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return 'R$ ' + val;
  }

  function parseCurrencyInput(value) {
      // Parse o valor numérico a partir da entrada formatada
      return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
  }

  function formatCurrency(value) {
      return 'R$ ' + value.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      });
  }

  // Inicializa os cálculos na carga da página
  updateValues();
});
