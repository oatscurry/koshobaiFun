{
  "hosting": {
    "rewrites": [ {
     "source": "**",
     "function": "app"
   } ],
   "public": "public",

    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
