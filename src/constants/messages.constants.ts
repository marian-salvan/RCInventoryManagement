export const appMessages = new Map<string, string>([
  ["appTitle", "Gestiunea donațiilor"],
  ["appTitleCrr", "CRR Cluj - Gestiunea donațiilor"],
  ["appGreeting", "Salut"],
  ["productsTitle", "Produse"],
  ["inventoryTitle", "Inventar"],
  ["packagesTitle", "Pachete"],
  ["reportsTitle", "Rapoarte"],
  ["logOutTitle", "Ieșiți din cont"],
  ["confirmationModalDefaultTitle", "Confirmă operația"],
  ["confirmationModalDefaultMessage", "Doriți să efectuați această operație?"],
  ["deleteProductModalTitle", "Confirmă ștergerea produsului"], 
  ["deleteProductModalMessage", "Doriți să ștergeți acest acest produs? El va fi șters din toate inventarele active din toate campaniile."], 
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
  ["addModalTitle", "Adaugă un produs nou"],
  ["editModalTitle", "Editează produsul"],
  ["searchByName", "Caută după nume"],
  ["loading", "Se încarcă"],
  ["accessDenied", "Nu ai acces la această pagină"],
  ["noActiveInventoryAdmin", "Nu există un inventar activ. Doriți să creați unul?"],
  ["noActiveInventory", "Nu există un inventar activ. Contactați administratorul pentru crearea lui."],
  ["noActiveInventoryAdminPckgs", "Pentru a adăuga pachete aveți nevoie de un invetar activ. Doriți să creați unul?"],
  ["noActiveInventoryPckgs", "Pentru a adăuga pachete aveți nevoie de un invetar activ. Contactați administratorul pentru crearea lui."],
  ["editWarning", "Datele acestui produs vor fi schimbate și în toate inventarele active din toate campaniile. Sigur doriți să efectuați această operație?"],
  ["campaigns", "Campanii"],
  ["createNewCampaigTitle", "Creați campanie"],
  ["modifyInventoryProductsTitle", "Modificați produsele din inventar"],
  ["modifyInventoryProductsMessage", `Atenție! Produsele pe care le veți scoate din inventar vor avea stocul șters! 
                                      Le veți putea adăuga din nou dar stocul lor va fi reinițializat cu 0.
                                      Descărcați un raport intermediar înainte de șterge produse.`],
  ["addProductWarning", `Produsul nu va fi adăugat automat în niciun inventar activ din nicio campanie. 
                         Va trebui să-l adăugați manual din inventar dorit.`]
])

export const appErrors = new Map<string, string>([
    ["genericErrorMessage", "A apărut o eroare. Încercați din nou!"], 
    ["existingActiveInventory", "Există deja un inventar activ"],
    ["existingInventoryName", "Există un inventar cu acest nume"],
    ["noProductInInventory", "Nu am găsit produsul în inventar"],
    ["insufficientStock", "Stoc insuficient"],
    ["existingProductName", "Există deja un produs cu acest nume"],
    ["existingCampaignName", "Există deja o campanie cu acest nume"]
]);

export const appLabels = new Map<string, string>([
  ["name", "Nume"],
  ["referencePrice", "Preț de referință"],
  ["unit", "Unitate de măsură"],
  ["category", "Categorie"],
  ["save", "Salvează"],
  ["cancel", "Anulează"],
  ["confirm", "Confirmă"],
  ["inventoryName", "Nume inventar"],
  ["packageNumber", "Număr de pachete"],
  ["packageQty", "Cantitate (KG)"],
  ["errorTitle", "Eroare"],
  ["errorConfirm", "OK"],
  ["selectCategory", "Selectează categoria"],
  ["all", "toate"],
  ["qty", "Cantitate"],
  ["login", "Intră în cont"],
  ["email", "Email"],
  ["password", "Parolă"],
  ["currentInventory", "Inventar curent"],
  ["closeCurrentInventory", "Închide inventarul curent"],
  ["downloadIntemReport", "Descarcă raport intermediar"],
  ["period", "Perioada"],
  ["inventoryGridProduct", "Nume produs"],
  ["inventoryGridCategory", "Categorie"],
  ["inventoryGridReferencePrice", "Preț de referință"],
  ["inventoryGridUnit", "Unitate de măsură"],
  ["inventoryGridQty", "Cantitate curentă"],
  ["inventoryGridTotalQty", "Cantitatea totală"],
  ["inventoryGridTotalPrice", "Preț total"],
  ["inventoryGridDeleteQty", "Șterge cantitate"],
  ["inventoryGridAddQty", "Adaugă cantitate"],
  ["newInventory", "Creați inventar nou"],
  ["goToInventory", "Mergeți la inventar"],
  ["addPackages", "Adaugă pachete"],
  ["deletePackages", "Șterge pachete"],
  ["packagesTotal", "Totalul de pachete"],
  ["packagesQty", "Cantitatea totală"],
  ["packagesAvgQty", "Cantitatea medie per pachet"],
  ["addProduct", "Adaugă produs"],
  ["deleteProduct", "Șterge Produsul"],
  ["editProduct", "Editează Produsul"],
  ["productList", "Lista de produse"],
  ["inventory", "Inventar"],
  ["downloadReport", "Descarcă raportul"],
  ["reportsTitle", "Rapoarte disponibile"],
  ["reportsGridInventory", "Nume inventar"],
  ["reportsGridOpenDate", "Data deschiderii"],
  ["reportsGridCloseDate", "Data închidere"],
  ["reportsGridSeeReport", "Vezi raportul"],
  ["edit", "Editează"],
  ["addToInventory", "Adaugă produsul la inventarul activ"],
  ["campaignName", "Nume campanie"],
  ["selectedCampaign", "Campania selectată"],
  ["addProductsToInventory", "Adaugă produse la noul inventar"],
  ["productOption", "Produse de adăugat"],
  ["modifyProductList", "Modifică lista de produse"],
  ["existingCampaigns", "Campanii existente"],
  ["createCampaign", "Crează campanie"],
  ["campaignCreationDate", "Data creării"],
  ["campaignState", "Stare"],
  ["campaignActive", "activă"],
  ["campaignInactive", "inactivă"]
]);

export const appValidations = new Map<string, string>([
  ["mandatoryName", "Numele este obligatoriu"],
  ["positivePrice", "Prețul trebuie să fie mai mare decât 0"],
  ["positivePackageNumber", "Numărul de pachete introdus trebuie să fie mai mare sau egal cu 0"],
  ["positivePackageQty", "Cantitatea introdusă trebuie să fie mai mare sau egală cu 0"],
  ["positiveInventoryQty", "Cantitatea introdusă trebuie să fie mai mare decât 0"],
  ["incorrectEmail", "Emailul introdus nu este corect"]
]); 

export const productSelectionOptions = new Map<string, string> (
  [
    ["all", "Toate produsele"],
    ["none", "Adaugă produsele mai târziu"],
    ["selectProducts", "Selectează produsele individuale"]
  ]
)