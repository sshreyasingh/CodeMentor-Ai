import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BugReportIcon from '@mui/icons-material/BugReport';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FunctionsIcon from '@mui/icons-material/Functions';
import DescriptionIcon from '@mui/icons-material/Description';

const severityColor = (severity) => {
  if (severity === 'high') return 'error';
  if (severity === 'medium') return 'warning';
  return 'info';
};

const SectionHeader = ({ icon, title, count, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ color }}>{icon}</Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {title}
    </Typography>
    <Chip label={count} size="small" sx={{ ml: 'auto', bgcolor: `${color}22`, color, fontWeight: 700 }} />
  </Box>
);

const ReviewPanel = ({ review, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Analyzing your code with DeepSeek R1...
        </Typography>
        <LinearProgress sx={{ width: '100%', borderRadius: 2 }} />
      </Box>
    );
  }

  if (!review) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Click "Review My Code" to analyze your code.
        </Typography>
      </Box>
    );
  }

  if (review.complexity?.error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error.main">{review.complexity.error}</Typography>
      </Box>
    );
  }

  const bugs = review.bugs || [];
  const security = review.security || [];
  const optimizations = review.optimizations || [];
  const documentation = review.documentation || [];
  const complexity = review.complexity || {};

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      {/* Bugs */}
      <Accordion defaultExpanded disableGutters sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader
            icon={<BugReportIcon />}
            title="Bugs"
            count={bugs.length}
            color="#ef4444"
          />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {bugs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No bugs detected.</Typography>
          ) : (
            bugs.map((bug, i) => (
              <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip label={`Line ${bug.line}`} size="small" variant="outlined" />
                  <Chip label={bug.severity} size="small" color={severityColor(bug.severity)} />
                </Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>{bug.description}</Typography>
                <Typography variant="caption" color="success.light" sx={{ fontFamily: 'monospace' }}>
                  Fix: {bug.suggestion}
                </Typography>
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Security */}
      <Accordion disableGutters sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader
            icon={<SecurityIcon />}
            title="Security"
            count={security.length}
            color="#f59e0b"
          />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {security.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No security issues found.</Typography>
          ) : (
            security.map((issue, i) => (
              <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip label={`Line ${issue.line}`} size="small" variant="outlined" />
                  <Chip label={issue.severity} size="small" color={severityColor(issue.severity)} />
                </Box>
                <Typography variant="body2" sx={{ mb: 0.5 }}>{issue.issue}</Typography>
                <Typography variant="caption" color="success.light" sx={{ fontFamily: 'monospace' }}>
                  Fix: {issue.remediation}
                </Typography>
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Optimizations */}
      <Accordion disableGutters sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader
            icon={<TrendingUpIcon />}
            title="Optimizations"
            count={optimizations.length}
            color="#22c55e"
          />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {optimizations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No optimization suggestions.</Typography>
          ) : (
            optimizations.map((opt, i) => (
              <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Typography variant="subtitle2" fontWeight={600}>{opt.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{opt.description}</Typography>
                {opt.before && (
                  <Box sx={{ mb: 0.5, p: 1, borderRadius: 0.5, bgcolor: '#1e1e1e', fontFamily: 'monospace', fontSize: 12 }}>
                    <Typography variant="caption" color="error.light">Before:</Typography>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{opt.before}</pre>
                  </Box>
                )}
                {opt.after && (
                  <Box sx={{ p: 1, borderRadius: 0.5, bgcolor: '#1e1e1e', fontFamily: 'monospace', fontSize: 12 }}>
                    <Typography variant="caption" color="success.light">After:</Typography>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{opt.after}</pre>
                  </Box>
                )}
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Complexity */}
      <Accordion disableGutters sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader
            icon={<FunctionsIcon />}
            title="Complexity"
            count={Object.keys(complexity).filter(k => k !== 'suggestions' && k !== 'error').length}
            color="#6366f1"
          />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {Object.keys(complexity).length === 0 || complexity.error ? (
            <Typography variant="body2" color="text.secondary">No complexity data.</Typography>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Big O</Typography>
                <Chip label={complexity.bigONotation || 'N/A'} size="small" color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2">Cyclomatic Complexity</Typography>
                <Chip label={complexity.cyclomaticComplexity ?? 'N/A'} size="small" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Readability</Typography>
                  <Typography variant="body2" fontWeight={700}>{complexity.readability || 0}/10</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(complexity.readability || 0) * 10}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
              {complexity.suggestions?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Suggestions:</Typography>
                  {complexity.suggestions.map((s, i) => (
                    <Typography key={i} variant="caption" sx={{ display: 'block', mt: 0.5 }}>• {s}</Typography>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      <Divider />

      {/* Documentation */}
      <Accordion disableGutters sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <SectionHeader
            icon={<DescriptionIcon />}
            title="Documentation"
            count={documentation.length}
            color="#a855f7"
          />
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          {documentation.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No documentation gaps found.</Typography>
          ) : (
            documentation.map((doc, i) => (
              <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
                <Chip label={doc.target} size="small" color="secondary" sx={{ mb: 0.5 }} />
                <Typography variant="body2" sx={{ mb: 0.5 }}>{doc.issue}</Typography>
                <Typography variant="caption" color="info.light">
                  Suggestion: {doc.suggestion}
                </Typography>
              </Box>
            ))
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ReviewPanel;
