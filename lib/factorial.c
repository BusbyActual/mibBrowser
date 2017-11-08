#include <stdint.h>

#if defined(WIN32) || defined(_WIN32)
#define EXPORT __declspec(dllexport)
#else
#define EXPORT
#endif

/* SmiModule -- the main structure of a module                               */
typedef struct SmiModule {
    char       *name;
    char       *path;
    char       *organization;
    char       *contactinfo;
    char       *description;
    char       *reference;
    int     language;
    int     conformance;
} SmiModule;

EXPORT uint64_t factorial(int max) {
  int i = max;
  uint64_t result = 1;

  while (i >= 2) {
    result *= i--;
  }

  return result;
}

EXPORT SmiModule* GetSmiModule() {
  struct SmiModule *retval = malloc(sizeof(struct SmiModule));
  
  retval->language = 1;
  retval->conformance = 2;
  
  return retval;
}