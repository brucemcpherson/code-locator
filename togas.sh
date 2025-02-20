# this simple script comments out the node import stuff 
# and moves selected files recursively to a folder that can be moved to gas with clasp
TARGET="bmCodeLocator"

# Define the input folder
SOURCE="code"

# a spec to match extension
EXT="*.js"

# whether to push with clasp
CLASP=true

# copy over all the files matching preservng the folder structure
find "${SOURCE}" -name "${EXT}" -print | cpio -pvdum "${TARGET}"


# find all the copied files and comment/fixes out import and export statements
# note - this simple version naively expects that to be on 1 line
sed -i 's/^import\s\s*/\/\/import /g' $(find "${TARGET}" -name "${EXT}" -type f) 
sed -i 's/^\s*export\s\s*//g' $(find "${TARGET}" -name "${EXT}" -type f)

# now go to the target and push and open if required
if [ "$CLASP" = true ] ; then
  cd "${TARGET}"
  clasp push
fi