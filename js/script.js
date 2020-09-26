document.addEventListener('DOMContentLoaded', () => {

    const numberButtons = document.querySelectorAll('[data-number]'),
          operationButtons = document.querySelectorAll('[data-operation]'),
          deleteButton = document.querySelector('[data-delete]'),
          allClearButton = document.querySelector('[data-all-clear]'),
          equalsButton = document.querySelector('[data-equals]'),
          previousOperandTextElement = document.querySelector('[data-previous-operand]'),
          currentOperandTextElement = document.querySelector('[data-current-operand]'),
          negativeButton = document.querySelector('[data-negative]'),
          sqrtButton = document.querySelector('[data-sqrt]');
    
    class Calculator {
        constructor(previousOperandTextElement, currentOperandTextElement) {
            this.previousOperandTextElement = previousOperandTextElement;
            this.currentOperandTextElement = currentOperandTextElement;
            this.readyToReset = false;
            this.clear();
        }

        // функция стирает все значения
        clear() {
            this.currentOperand = '';
            this.previousOperand = '';
            this.operation = undefined;
            this.readyToReset = false;
        }

        // функция удаляет последнее значение
        delete() {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }

        //функция добавляет значения в поле ввода калькулятора
        appendNumber(number) {
            if (number === '.' && this.currentOperand.includes('.')) return;
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }

        //функция добавляет операцию которую необходимо провести над операндами
        chooseOperation(operation) {
            if (this.currentOperand === '') return;
            if (this.previousOperand !== '' && this.currentOperand !== '') {
                this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';
        }

        //функция вычисляет квадратный корень из числа
        operationSqrt() {
            let comp;
            const current = parseFloat(this.currentOperand);

            if (this.currentOperand === '' ) return;
            if (current >= 0) {
                comp = Math.sqrt(current);
            } else {
                comp = "Error";
            }
    
            this.readyToReset = true;
            if (comp === "Error") {
                this.currentOperand = "Error";
            } else {
                this.currentOperand = +comp.toFixed(6);
            }
            this.operation = undefined;
            this.previousOperand = '';
        }

        //функция меняет знак числа
        negative() {
            if (this.currentOperand.toString().startsWith('-')) {
                this.currentOperand = this.currentOperand.toString().slice(1)
              } else {
                this.currentOperand = `-${this.currentOperand}`
              }
        }

        //функция проводит операцию над выражением
        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            const current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
            }
            computation = +computation.toFixed(6);
            this.readyToReset = true;
            this.currentOperand = computation;
            this.operation = undefined;
            this.previousOperand = '';
        }

        //функция помогает правильно отобразить значение на экране
        getDisplayNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const decimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            if (this.currentOperand === "Error") {
                return this.currentOperand;
            }
            if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
            }
            if (decimalDigits != null) {
                return `${integerDisplay}.${decimalDigits}`;
            } else {
                return integerDisplay;
            }
        }

        // функция выводит результат на экран
        updateDisplay() {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
            if (this.operation != null) {
                this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation} ${this.getDisplayNumber(this.currentOperand)}`;
            } else {
                this.previousOperandTextElement.innerText = '';
            }
        }

    }

    //создаем объект
    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    //добавляем цифры
    numberButtons.forEach(button => {
        //событие при клике мыши на кнопки символов
        button.addEventListener('click', () => {
            //проверка
            if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset) {
                calculator.currentOperand = "";
                calculator.readyToReset = false;
            }
            //получаем текстовое содержимое и добавляем содержимое на экран
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    //добавляем знак операции
    operationButtons.forEach(button => {
        //событие при клике мыши на кнопки операций
        button.addEventListener('click', () => {
            //получаем текстовое содержимое, опеределяем операцию и добавляем ее на экран
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    });

    //событие при клике мыши на кнопку равно
    equalsButton.addEventListener('click', button => {
        //выполняем опеределенную операцию и добавляем результат на экран
        calculator.compute();
        calculator.updateDisplay();
    });

    //событие при клике мыши на кнопку АС
    allClearButton.addEventListener('click', button => {
        //стираем все значения с экрана
        calculator.clear();
        calculator.updateDisplay();
    });

    //событие при клике мыши на кнопку DEL
    deleteButton.addEventListener('click', button => {
        //стираем последнее значение с экрана
        calculator.delete();
        calculator.updateDisplay();
    });

    // событие при клике мыши на кнопку ±
    negativeButton.addEventListener('click', button => {
        //меняем знак числа
        calculator.negative();
        calculator.updateDisplay();
    });

    // событие при клике мыши на кнопку √
    sqrtButton.addEventListener('click', button => {
        //выполняем операцию квадратного корня
        calculator.operationSqrt();
        calculator.updateDisplay();
    });

});