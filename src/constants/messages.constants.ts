export const appMessages = new Map<string, string>([
  ["confirmationModalDefaultTitle", "Confirmă operația"],
  ["confirmationModalDefaultMessage", "Doriți să efectuați această operație?"],
  ["deleteProductModalTitle", "Confirmă ștergerea produsului"], 
  ["deleteProductModalMessage", "Doriți să ștergeți acest acest produs? El va fi șters și din inventarul curent."], 
  ["closeCurrentInventoryTitle", "Închidere inventar"], 
  ["closeCurrentInventoryMessage", `Doriți să închideți inventarul curent? Nu veți
                                    mai putea face modificări asupra lui, dar veți putea vedea raportul rezultat în pagina de rapoarte.`], 
  ["createCurrentInventoryTitle", "Creați inventar"],
  ["createCurrentInventoryMessage",  `Doriți să creați un inventar nou? Acest inventar va fi
                                    disponibil până îl veți închide. După închidere, se va crea un raport pe perioda în care a fost deschis
                                    inventarul.`], 
  ["addQuantityModalTitle", "Adaugă"], 
  ["addQuantityModalMessage", "Adaugă"], 
  ["removeQuantityModalTitle", "Scade"], 
  ["removeQuantityModalMessage", "Scade"], 
])

export const appErrors = new Map<string, string>([
    ["genericErrorMessage", "A apărut o eroare. Încercați din nou!"], 
]);