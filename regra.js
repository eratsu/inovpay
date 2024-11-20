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
          taxas = [3.83, 5.69, 6.29, 6.89, 7.49, 8.09, 9.29, 9.89, 10.64, 11.19, 11.89, 12.49, 12.99, 13.29, 13.99, 14.67, 15.48, 15.91];
          taxa_debito = 1.61;
          break;
      case "outros":
          taxas = [4.05, 5.78, 6.39, 7.02, 7.54, 8.13, 9.59, 10.19, 10.79, 11.29, 12.09, 12.49, 12.69, 13.67, 14.09, 14.98, 15.45, 15.98];
          taxa_debito = 1.97;
          break;
      default:
          taxas = [4.05, 5.78, 6.39, 7.02, 7.54, 8.13, 9.59, 10.19, 10.79, 11.29, 12.09, 12.49, 12.69, 13.67, 14.09, 14.98, 15.45, 15.98];
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
